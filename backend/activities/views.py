from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdmin
from .models import Activity
from .serializers import ActivitySerializer


class ActivityListView(generics.ListAPIView):
    """List all activity logs (admin only)."""

    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = Activity.objects.select_related('user').all()
    filterset_fields = ['target_model', 'user']
    search_fields = ['action']
    ordering_fields = ['created_at']
