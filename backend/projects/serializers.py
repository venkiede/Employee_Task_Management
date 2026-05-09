from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project

User = get_user_model()


class ProjectListSerializer(serializers.ModelSerializer):
    """Serializer for project listing with computed fields."""

    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    task_count = serializers.ReadOnlyField()
    completed_task_count = serializers.ReadOnlyField()
    progress_percentage = serializers.ReadOnlyField()
    team_member_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status', 'start_date', 'end_date',
            'team_members', 'created_by', 'created_by_name', 'task_count', 'completed_task_count',
            'progress_percentage', 'team_member_count', 'created_at', 'updated_at'
        ]

    def get_team_member_count(self, obj):
        return obj.team_members.count()


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with team member info."""

    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    task_count = serializers.ReadOnlyField()
    completed_task_count = serializers.ReadOnlyField()
    progress_percentage = serializers.ReadOnlyField()
    team_members_detail = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status', 'start_date', 'end_date',
            'team_members', 'team_members_detail', 'created_by', 'created_by_name',
            'task_count', 'completed_task_count', 'progress_percentage',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by']

    def get_team_members_detail(self, obj):
        return [
            {'id': m.id, 'full_name': m.full_name, 'email': m.email, 'role': m.role}
            for m in obj.team_members.all()
        ]


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating projects."""

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status', 'start_date',
            'end_date', 'team_members'
        ]

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Project name is required.")
        return value.strip()

    def validate(self, attrs):
        start = attrs.get('start_date')
        end = attrs.get('end_date')
        if start and end and end < start:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date.'
            })
        return attrs
