import django_filters
from projects.models import Project
from .models import Task


class TaskFilter(django_filters.FilterSet):
    """Filter set for tasks."""

    title = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=Task.Status.choices)
    priority = django_filters.ChoiceFilter(choices=Task.Priority.choices)
    project = django_filters.NumberFilter(field_name='project__id')
    project_status = django_filters.ChoiceFilter(
        field_name='project__status',
        choices=Project.Status.choices
    )
    assigned_to = django_filters.NumberFilter(field_name='assigned_to__id')
    deadline_before = django_filters.DateTimeFilter(field_name='deadline', lookup_expr='lte')
    deadline_after = django_filters.DateTimeFilter(field_name='deadline', lookup_expr='gte')
    is_overdue = django_filters.BooleanFilter(method='filter_overdue')

    class Meta:
        model = Task
        fields = ['title', 'status', 'priority', 'project', 'project_status', 'assigned_to']

    def filter_overdue(self, queryset, name, value):
        from django.utils import timezone
        if value:
            return queryset.filter(
                deadline__lt=timezone.now()
            ).exclude(status='completed')
        return queryset
