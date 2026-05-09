from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q
from django.contrib.auth import get_user_model

from accounts.permissions import IsAdmin
from core.responses import success_response
from projects.models import Project
from tasks.models import Task
from activities.models import Activity

User = get_user_model()


class AdminDashboardView(APIView):
    """Dashboard analytics for admin users."""

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        now = timezone.now()

        # Project stats
        total_projects = Project.objects.count()
        projects_by_status = dict(
            Project.objects.values_list('status').annotate(count=Count('id')).values_list('status', 'count')
        )

        # Task stats
        total_tasks = Task.objects.count()
        tasks_by_status = dict(
            Task.objects.values_list('status').annotate(count=Count('id')).values_list('status', 'count')
        )
        overdue_tasks = Task.objects.filter(
            deadline__lt=now
        ).exclude(status='completed').count()

        # Team stats
        total_members = User.objects.filter(is_active=True).count()
        admins = User.objects.filter(role='admin', is_active=True).count()
        members = User.objects.filter(role='member', is_active=True).count()

        # Recent activities
        recent_activities = Activity.objects.select_related('user').all()[:10]
        activities_data = [
            {
                'id': a.id,
                'user': a.user.full_name,
                'action': a.action,
                'target_model': a.target_model,
                'created_at': a.created_at.isoformat(),
            }
            for a in recent_activities
        ]

        # Task priority breakdown
        tasks_by_priority = dict(
            Task.objects.values_list('priority').annotate(count=Count('id')).values_list('priority', 'count')
        )

        data = {
            'projects': {
                'total': total_projects,
                'pending': projects_by_status.get('pending', 0),
                'in_progress': projects_by_status.get('in_progress', 0),
                'completed': projects_by_status.get('completed', 0),
            },
            'tasks': {
                'total': total_tasks,
                'todo': tasks_by_status.get('todo', 0),
                'in_progress': tasks_by_status.get('in_progress', 0),
                'completed': tasks_by_status.get('completed', 0),
                'overdue': overdue_tasks,
            },
            'tasks_by_priority': {
                'low': tasks_by_priority.get('low', 0),
                'medium': tasks_by_priority.get('medium', 0),
                'high': tasks_by_priority.get('high', 0),
            },
            'team': {
                'total': total_members,
                'admins': admins,
                'members': members,
            },
            'recent_activities': activities_data,
        }

        return success_response(data=data, message="Admin dashboard data retrieved.")


class MemberDashboardView(APIView):
    """Dashboard analytics for member users."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()

        # My tasks
        my_tasks = Task.objects.filter(assigned_to=user)
        total_tasks = my_tasks.count()
        tasks_by_status = dict(
            my_tasks.values_list('status').annotate(count=Count('id')).values_list('status', 'count')
        )
        overdue = my_tasks.filter(deadline__lt=now).exclude(status='completed').count()

        # Upcoming deadlines (next 7 days)
        week_later = now + timezone.timedelta(days=7)
        upcoming_deadlines = my_tasks.filter(
            deadline__gte=now,
            deadline__lte=week_later
        ).exclude(status='completed').order_by('deadline')[:5]

        upcoming_data = [
            {
                'id': t.id,
                'title': t.title,
                'project': t.project.name,
                'deadline': t.deadline.isoformat() if t.deadline else None,
                'priority': t.priority,
                'status': t.status,
            }
            for t in upcoming_deadlines
        ]

        # My projects
        my_projects = Project.objects.filter(team_members=user)

        data = {
            'tasks': {
                'total': total_tasks,
                'todo': tasks_by_status.get('todo', 0),
                'in_progress': tasks_by_status.get('in_progress', 0),
                'completed': tasks_by_status.get('completed', 0),
                'overdue': overdue,
            },
            'projects_count': my_projects.count(),
            'upcoming_deadlines': upcoming_data,
        }

        return success_response(data=data, message="Member dashboard data retrieved.")
