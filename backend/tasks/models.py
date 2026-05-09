from django.db import models
from django.conf import settings
from django.utils import timezone


class Task(models.Model):
    """Task model — belongs to a project, assigned to a user."""

    class Status(models.TextChoices):
        TODO = 'todo', 'To Do'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        OVERDUE = 'overdue', 'Overdue'

    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    priority = models.CharField(
        max_length=10, choices=Priority.choices, default=Priority.MEDIUM, db_index=True
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.TODO, db_index=True
    )
    deadline = models.DateTimeField(null=True, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_tasks'
    )
    project = models.ForeignKey(
        'projects.Project', on_delete=models.CASCADE, related_name='tasks'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_tasks'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['project']),
            models.Index(fields=['deadline']),
        ]

    def __str__(self):
        return self.title

    @property
    def is_overdue(self):
        if self.deadline and self.status != self.Status.COMPLETED:
            return timezone.now() > self.deadline
        return False

    def save(self, *args, **kwargs):
        # Auto-mark as overdue if deadline has passed
        if self.is_overdue and self.status != self.Status.COMPLETED:
            self.status = self.Status.OVERDUE
        super().save(*args, **kwargs)
