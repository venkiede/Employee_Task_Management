from rest_framework import serializers
from django.utils import timezone
from .models import Task


class TaskListSerializer(serializers.ModelSerializer):
    """Serializer for task listings."""

    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True, default=None)
    project_name = serializers.CharField(source='project.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'status', 'deadline',
            'assigned_to', 'assigned_to_name', 'project', 'project_name',
            'created_by', 'created_by_name', 'is_overdue',
            'created_at', 'updated_at'
        ]


class TaskDetailSerializer(serializers.ModelSerializer):
    """Detailed task serializer."""

    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True, default=None)
    assigned_to_email = serializers.CharField(source='assigned_to.email', read_only=True, default=None)
    project_name = serializers.CharField(source='project.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'status', 'deadline',
            'assigned_to', 'assigned_to_name', 'assigned_to_email',
            'project', 'project_name',
            'created_by', 'created_by_name', 'is_overdue',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by']


class TaskCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating tasks."""

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'status',
            'deadline', 'assigned_to', 'project'
        ]

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Task title is required.")
        return value.strip()

    def validate_deadline(self, value):
        if value and value < timezone.now():
            raise serializers.ValidationError("Deadline cannot be in the past.")
        return value

    def validate(self, attrs):
        # If assigning to a user, ensure they are a team member of the project
        assigned_to = attrs.get('assigned_to')
        project = attrs.get('project') or (self.instance.project if self.instance else None)
        if assigned_to and project:
            if not project.team_members.filter(id=assigned_to.id).exists():
                # Also allow if the assigned user is the project creator
                if project.created_by != assigned_to:
                    raise serializers.ValidationError({
                        'assigned_to': 'User must be a team member of the project.'
                    })
        return attrs


class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for members to update only task status."""

    class Meta:
        model = Task
        fields = ['status']
