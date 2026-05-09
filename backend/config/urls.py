from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
import os
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

def cors_debug(request):
    import django.conf as conf
    return JsonResponse({
        "DJANGO_SETTINGS_MODULE": os.environ.get('DJANGO_SETTINGS_MODULE'),
        "CORS_ALLOW_ALL_ORIGINS": getattr(conf.settings, 'CORS_ALLOW_ALL_ORIGINS', 'NOT SET'),
        "CORS_ALLOWED_ORIGINS": getattr(conf.settings, 'CORS_ALLOWED_ORIGINS', 'NOT SET'),
        "MIDDLEWARE": conf.settings.MIDDLEWARE,
        "DEBUG": conf.settings.DEBUG,
        "APPEND_SLASH": conf.settings.APPEND_SLASH,
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('debug-cors/', cors_debug),

    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/team-members/', include('team.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/activities/', include('activities.urls')),

    # Swagger/OpenAPI docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
