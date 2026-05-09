from django.contrib import admin
from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'target_model', 'target_id', 'created_at')
    list_filter = ('target_model', 'created_at')
    search_fields = ('action', 'user__email')
    readonly_fields = ('created_at',)
