from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from accounts.permissions import IsAdmin, IsAdminOrReadOnly, IsOwnerOrAdmin
from core.responses import success_response, error_response
from .models import Task
from .serializers import (
    TaskListSerializer, TaskDetailSerializer,
    TaskCreateUpdateSerializer, TaskStatusUpdateSerializer
)
from .filters import TaskFilter


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task CRUD.
    - Admin: full CRUD on all tasks
    - Member: read assigned tasks, update status only
    """

    permission_classes = [IsAuthenticated]
    filterset_class = TaskFilter
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at', 'deadline', 'priority', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        qs = Task.objects.select_related('assigned_to', 'project', 'created_by')
        if user.role == 'admin':
            return qs.all()
        return qs.filter(assigned_to=user)

    def get_serializer_class(self):
        if self.action == 'list':
            return TaskListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            # Members can only update status
            if self.request.user.role == 'member' and self.action in ['update', 'partial_update']:
                return TaskStatusUpdateSerializer
            return TaskCreateUpdateSerializer
        return TaskDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        # Members can only update status of tasks assigned to them
        if request.user.role == 'member':
            if task.assigned_to != request.user:
                return error_response(
                    message="You can only update tasks assigned to you.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            serializer = TaskStatusUpdateSerializer(task, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return success_response(
                data=TaskDetailSerializer(task).data,
                message="Task status updated."
            )
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='my-tasks')
    def my_tasks(self, request):
        """Get tasks assigned to the current user."""
        tasks = Task.objects.filter(
            assigned_to=request.user
        ).select_related('project', 'created_by')
        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = TaskListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = TaskListSerializer(tasks, many=True)
        return success_response(data=serializer.data)

    @action(detail=False, methods=['get'], url_path='overdue')
    def overdue_tasks(self, request):
        """Get all overdue tasks."""
        from django.utils import timezone
        tasks = self.get_queryset().filter(
            deadline__lt=timezone.now()
        ).exclude(status='completed')
        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = TaskListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = TaskListSerializer(tasks, many=True)
        return success_response(data=serializer.data)
