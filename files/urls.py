from django.urls import path
from .views import (
    FileUploadView, UserFilesView, FileDeleteView,
    download_file, download_multiple_files, user_stats
)

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file_upload'),
    path('my-files/', UserFilesView.as_view(), name='user_files'),
    path('delete/<int:pk>/', FileDeleteView.as_view(), name='file_delete'),
    path('download/<int:file_id>/', download_file, name='download_file'),
    path('download-multiple/', download_multiple_files, name='download_multiple'),
    path('stats/', user_stats, name='user_stats'),
]