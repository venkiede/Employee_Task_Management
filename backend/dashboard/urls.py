from django.urls import path
from . import views

urlpatterns = [
    path('admin/', views.AdminDashboardView.as_view(), name='dashboard-admin'),
    path('member/', views.MemberDashboardView.as_view(), name='dashboard-member'),
]
