from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Project


@receiver(post_save, sender=Project)
def project_saved(sender, instance, created, **kwargs):
    """Log activity when a project is created or updated."""
    from activities.models import Activity
    action = 'created' if created else 'updated'
    # Use getattr to safely get created_by — may be None during migrations
    user = getattr(instance, 'created_by', None)
    if user:
        Activity.objects.create(
            user=user,
            action=f"Project '{instance.name}' was {action}.",
            target_model='Project',
            target_id=instance.id,
        )


@receiver(post_delete, sender=Project)
def project_deleted(sender, instance, **kwargs):
    """Log activity when a project is deleted."""
    from activities.models import Activity
    user = getattr(instance, 'created_by', None)
    if user:
        Activity.objects.create(
            user=user,
            action=f"Project '{instance.name}' was deleted.",
            target_model='Project',
            target_id=instance.id,
        )
