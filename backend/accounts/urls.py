from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    re_path(r'^register/?$', views.RegisterView.as_view(), name='auth-register'),
    re_path(r'^login/?$', views.LoginView.as_view(), name='auth-login'),
    re_path(r'^logout/?$', views.LogoutView.as_view(), name='auth-logout'),
    re_path(r'^refresh/?$', TokenRefreshView.as_view(), name='auth-refresh'),
    re_path(r'^profile/?$', views.ProfileView.as_view(), name='auth-profile'),
    re_path(r'^change-password/?$', views.ChangePasswordView.as_view(), name='auth-change-password'),
    re_path(r'^users/?$', views.UserListView.as_view(), name='auth-users'),
]
