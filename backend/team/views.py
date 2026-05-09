from rest_framework import generics, status
from django.contrib.auth import get_user_model
from django.utils import timezone
from accounts.permissions import IsAdmin
from core.responses import success_response, created_response, error_response
from .serializers import TeamMemberSerializer, TeamMemberActionSerializer

User = get_user_model()

class TeamMemberListView(generics.ListCreateAPIView):
    """List active team members and create new ones."""
    permission_classes = [IsAdmin]
    serializer_class = TeamMemberSerializer
    
    def get_queryset(self):
        return User.objects.filter(is_removed=False).order_by('-date_joined')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return created_response(
            data=TeamMemberSerializer(user).data, 
            message="Team member added successfully."
        )

class RemovedTeamMemberListView(generics.ListAPIView):
    """List removed team members."""
    permission_classes = [IsAdmin]
    serializer_class = TeamMemberActionSerializer
    
    def get_queryset(self):
        return User.objects.filter(is_removed=True).order_by('-removed_at')

class TeamMemberRemoveView(generics.UpdateAPIView):
    """Soft delete a team member."""
    permission_classes = [IsAdmin]
    serializer_class = TeamMemberActionSerializer
    queryset = User.objects.filter(is_removed=False)

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_removed = True
        user.removed_at = timezone.now()
        user.is_active = False  # Prevent login
        user.save()
        return success_response(message="Team member removed successfully.")

class TeamMemberRestoreView(generics.UpdateAPIView):
    """Restore a removed team member."""
    permission_classes = [IsAdmin]
    serializer_class = TeamMemberActionSerializer
    queryset = User.objects.filter(is_removed=True)

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_removed = False
        user.removed_at = None
        user.is_active = True
        user.save()
        return success_response(message="Team member restored successfully.")
