from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for activity log entries."""

    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_name', 'user_email', 'action', 'target_model', 'target_id', 'created_at']
        read_only_fields = fields
