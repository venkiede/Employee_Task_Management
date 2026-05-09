from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', views.NotificationUpdateView.as_view(), name='notification-update'),
    path('mark-all-read/', views.MarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('unread-count/', views.UnreadCountView.as_view(), name='notification-unread-count'),
]
