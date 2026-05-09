from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allows access only to admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class IsMember(permissions.BasePermission):
    """Allows access only to member users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'member'
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission: allows access if the user is an admin
    or if the user owns the object (obj.user or obj.created_by == request.user).
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        # Check common owner field names
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        if hasattr(obj, 'assigned_to'):
            return obj.assigned_to == request.user
        return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Admins can perform any action.
    Other authenticated users get read-only access.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'admin'
