import django_filters
from .models import Project


class ProjectFilter(django_filters.FilterSet):
    """Filter set for projects — supports status, date range, and created_by."""

    name = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=Project.Status.choices)
    start_date_after = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')
    end_date_before = django_filters.DateFilter(field_name='end_date', lookup_expr='lte')
    created_by = django_filters.NumberFilter(field_name='created_by__id')

    class Meta:
        model = Project
        fields = ['name', 'status', 'created_by']
