from rest_framework import serializers
from .models import UploadedFile, ShareLink

class UploadedFileSerializer(serializers.ModelSerializer):
    file_size_mb = serializers.ReadOnlyField()
    
    class Meta:
        model = UploadedFile
        fields = ('id', 'original_name', 'file_size', 'file_size_mb', 'content_type', 
                 'upload_date', 'download_count', 'is_active')
        read_only_fields = ('id', 'upload_date', 'download_count')

class FileUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField()
    
    class Meta:
        model = UploadedFile
        fields = ('file',)
    
    def create(self, validated_data):
        file = validated_data['file']
        uploaded_file = UploadedFile.objects.create(
            user=self.context['request'].user,
            file=file,
            original_name=file.name,
            file_size=file.size,
            content_type=file.content_type
        )
        return uploaded_file

class ShareLinkSerializer(serializers.ModelSerializer):
    file_name = serializers.CharField(source='file.original_name', read_only=True)
    
    class Meta:
        model = ShareLink
        fields = ('id', 'share_token', 'file_name', 'created_at', 'expires_at', 
                 'is_active', 'access_count')
        read_only_fields = ('id', 'share_token', 'created_at', 'access_count')