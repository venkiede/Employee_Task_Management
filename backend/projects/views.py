from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from accounts.permissions import IsAdmin, IsAdminOrReadOnly
from core.responses import success_response
from .models import Project
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer, ProjectCreateUpdateSerializer
)
from .filters import ProjectFilter


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Project CRUD operations.
    - Admin: full CRUD
    - Member: read-only (only their assigned projects)
    """

    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filterset_class = ProjectFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'status', 'start_date', 'end_date']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all().prefetch_related('team_members')
        # Members only see projects they are assigned to
        return Project.objects.filter(
            team_members=user
        ).prefetch_related('team_members')

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateUpdateSerializer
        return ProjectDetailSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def add_members(self, request, pk=None):
        """Add team members to a project."""
        project = self.get_object()
        member_ids = request.data.get('member_ids', [])
        from django.contrib.auth import get_user_model
        User = get_user_model()
        members = User.objects.filter(id__in=member_ids, is_active=True)
        project.team_members.add(*members)
        return success_response(message=f"{members.count()} member(s) added.")

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def remove_members(self, request, pk=None):
        """Remove team members from a project."""
        project = self.get_object()
        member_ids = request.data.get('member_ids', [])
        from django.contrib.auth import get_user_model
        User = get_user_model()
        members = User.objects.filter(id__in=member_ids)
        project.team_members.remove(*members)
        return success_response(message=f"{members.count()} member(s) removed.")
