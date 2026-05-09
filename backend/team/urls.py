from django.urls import path
from . import views

urlpatterns = [
    path('', views.TeamMemberListView.as_view(), name='team-member-list'),
    path('removed/', views.RemovedTeamMemberListView.as_view(), name='team-member-removed'),
    path('<int:pk>/remove/', views.TeamMemberRemoveView.as_view(), name='team-member-remove'),
    path('<int:pk>/restore/', views.TeamMemberRestoreView.as_view(), name='team-member-restore'),
]
