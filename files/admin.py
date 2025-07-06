from django.contrib import admin
from .models import UploadedFile, ShareLink

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('original_name', 'user', 'file_size_mb', 'upload_date', 'download_count', 'is_active')
    list_filter = ('upload_date', 'is_active', 'content_type')
    search_fields = ('original_name', 'user__email')
    readonly_fields = ('upload_date', 'file_size')
    list_per_page = 50

@admin.register(ShareLink)
class ShareLinkAdmin(admin.ModelAdmin):
    list_display = ('file', 'share_token', 'created_at', 'expires_at', 'is_active', 'access_count')
    list_filter = ('created_at', 'is_active')
    search_fields = ('share_token', 'file__original_name')
    readonly_fields = ('created_at', 'access_count')