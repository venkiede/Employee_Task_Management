from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'assigned_to', 'status', 'priority', 'deadline', 'created_at')
    list_filter = ('status', 'priority', 'project', 'created_at')
    search_fields = ('title', 'description')
    raw_id_fields = ('assigned_to', 'project', 'created_by')
    readonly_fields = ('created_at', 'updated_at')
