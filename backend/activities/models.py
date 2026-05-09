from django.db import models
from django.conf import settings


class Activity(models.Model):
    """Activity/audit log model — tracks all important actions in the system."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities'
    )
    action = models.TextField()
    target_model = models.CharField(max_length=50, blank=True, default='')
    target_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'activities'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['target_model']),
        ]

    def __str__(self):
        return f"[{self.user.full_name}] {self.action[:60]}"
