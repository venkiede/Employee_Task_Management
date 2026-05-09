from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Task


@receiver(pre_save, sender=Task)
def track_task_changes(sender, instance, **kwargs):
    """Track status changes and assignment changes before save."""
    if instance.pk:
        try:
            old_task = Task.objects.get(pk=instance.pk)
            instance._old_status = old_task.status
            instance._old_assigned_to = old_task.assigned_to
        except Task.DoesNotExist:
            instance._old_status = None
            instance._old_assigned_to = None
    else:
        instance._old_status = None
        instance._old_assigned_to = None


@receiver(post_save, sender=Task)
def task_saved(sender, instance, created, **kwargs):
    """Create notifications and activity logs when tasks change."""
    from notifications.models import Notification
    from activities.models import Activity

    if created:
        # Log activity
        user = getattr(instance, 'created_by', None)
        if user:
            Activity.objects.create(
                user=user,
                action=f"Task '{instance.title}' was created in project '{instance.project.name}'.",
                target_model='Task',
                target_id=instance.id,
            )

        # Notify assigned user
        if instance.assigned_to and instance.assigned_to != instance.created_by:
            Notification.objects.create(
                user=instance.assigned_to,
                message=f"You have been assigned a new task: '{instance.title}' in project '{instance.project.name}'.",
                notification_type='task_assigned',
            )
    else:
        # Status change notification
        old_status = getattr(instance, '_old_status', None)
        if old_status and old_status != instance.status:
            Activity.objects.create(
                user=instance.created_by,
                action=f"Task '{instance.title}' status changed from '{old_status}' to '{instance.status}'.",
                target_model='Task',
                target_id=instance.id,
            )
            # Notify project creator about status change
            if instance.project.created_by != instance.assigned_to:
                Notification.objects.create(
                    user=instance.project.created_by,
                    message=f"Task '{instance.title}' status updated to '{instance.get_status_display()}'.",
                    notification_type='status_update',
                )

        # Assignment change notification
        old_assigned = getattr(instance, '_old_assigned_to', None)
        if old_assigned != instance.assigned_to and instance.assigned_to:
            Notification.objects.create(
                user=instance.assigned_to,
                message=f"You have been assigned to task: '{instance.title}'.",
                notification_type='task_assigned',
            )
