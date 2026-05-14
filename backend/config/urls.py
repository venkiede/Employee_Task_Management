from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.db import connections
from django.db.utils import OperationalError
import os
import django.conf as conf
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


def health_check(request):
    database_ok = True

    try:
        connections['default'].ensure_connection()
    except OperationalError:
        database_ok = False

    status_code = 200 if database_ok else 503
    return JsonResponse({
        "status": "ok" if database_ok else "error",
        "service": "backend",
        "database": "ok" if database_ok else "unavailable",
        "settings_module": os.environ.get('DJANGO_SETTINGS_MODULE'),
    }, status=status_code)


def cors_debug(request):
    return JsonResponse({
        "SETTINGS_MODULE": os.environ.get('DJANGO_SETTINGS_MODULE'),
        "CORS_ALLOW_ALL_ORIGINS": getattr(conf.settings, 'CORS_ALLOW_ALL_ORIGINS', 'NOT SET'),
        "CORS_ALLOWED_ORIGINS": getattr(conf.settings, 'CORS_ALLOWED_ORIGINS', 'NOT SET'),
        "MIDDLEWARE": list(conf.settings.MIDDLEWARE),
        "DEBUG": conf.settings.DEBUG,
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check),

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
    urlpatterns += [path('debug-cors/', cors_debug)]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
