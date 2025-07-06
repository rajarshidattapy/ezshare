from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import UploadedFile, ShareLink
from .serializers import UploadedFileSerializer, FileUploadSerializer, ShareLinkSerializer
import os
import zipfile
import tempfile
from django.conf import settings
import secrets

User = get_user_model()

class FileUploadView(generics.CreateAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        files = request.FILES.getlist('files')
        uploaded_files = []
        
        for file in files:
            serializer = self.get_serializer(data={'file': file})
            serializer.is_valid(raise_exception=True)
            uploaded_file = serializer.save()
            uploaded_files.append(uploaded_file)
        
        return Response({
            'message': f'Successfully uploaded {len(uploaded_files)} files',
            'files': UploadedFileSerializer(uploaded_files, many=True).data
        }, status=status.HTTP_201_CREATED)

class UserFilesView(generics.ListAPIView):
    serializer_class = UploadedFileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UploadedFile.objects.filter(user=self.request.user, is_active=True)

class FileDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UploadedFile.objects.filter(user=self.request.user)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({'message': 'File deleted successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, file_id):
    file_obj = get_object_or_404(UploadedFile, id=file_id, user=request.user, is_active=True)
    
    try:
        file_path = file_obj.file.path
        if os.path.exists(file_path):
            with open(file_path, 'rb') as f:
                response = HttpResponse(f.read(), content_type=file_obj.content_type)
                response['Content-Disposition'] = f'attachment; filename="{file_obj.original_name}"'
                
                # Update download count
                file_obj.download_count += 1
                file_obj.save()
                
                return response
        else:
            raise Http404("File not found")
    except Exception as e:
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def download_multiple_files(request):
    file_ids = request.data.get('file_ids', [])
    
    if not file_ids:
        return Response({'error': 'No files selected'}, status=status.HTTP_400_BAD_REQUEST)
    
    files = UploadedFile.objects.filter(id__in=file_ids, user=request.user, is_active=True)
    
    if not files.exists():
        return Response({'error': 'No valid files found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create a temporary zip file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_zip:
        with zipfile.ZipFile(temp_zip.name, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file_obj in files:
                if os.path.exists(file_obj.file.path):
                    zip_file.write(file_obj.file.path, file_obj.original_name)
                    # Update download count
                    file_obj.download_count += 1
                    file_obj.save()
        
        # Read the zip file and return as response
        with open(temp_zip.name, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="files.zip"'
        
        # Clean up temporary file
        os.unlink(temp_zip.name)
        
        return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    user = request.user
    files = UploadedFile.objects.filter(user=user, is_active=True)
    
    stats = {
        'total_files': files.count(),
        'total_size_mb': round(sum(f.file_size for f in files) / (1024 * 1024), 2),
        'total_downloads': sum(f.download_count for f in files)
    }
    
    return Response(stats)