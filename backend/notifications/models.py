from django.db import models
from django.conf import settings


class Notification(models.Model):
    """Notification model — stores in-app notifications for users."""

    class NotificationType(models.TextChoices):
        TASK_ASSIGNED = 'task_assigned', 'Task Assigned'
        STATUS_UPDATE = 'status_update', 'Status Update'
        DEADLINE_REMINDER = 'deadline_reminder', 'Deadline Reminder'
        PROJECT_UPDATE = 'project_update', 'Project Update'
        GENERAL = 'general', 'General'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications'
    )
    message = models.TextField()
    notification_type = models.CharField(
        max_length=30, choices=NotificationType.choices, default=NotificationType.GENERAL
    )
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"[{self.notification_type}] {self.message[:50]}"
