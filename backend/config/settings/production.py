from .base import *
from decouple import config, Csv
import dj_database_url
from urllib.parse import urlparse


def split_csv(value):
    if not value:
        return []
    if isinstance(value, (list, tuple)):
        return [str(item).strip() for item in value if str(item).strip()]
    return [item.strip() for item in str(value).split(',') if item.strip()]


def unique(values):
    seen = set()
    cleaned = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            cleaned.append(value)
    return cleaned


def normalize_origin(value):
    if not value:
        return ''
    cleaned = str(value).strip().rstrip('/')
    if not cleaned:
        return ''
    if cleaned.startswith('http://') or cleaned.startswith('https://'):
        return cleaned
    return f'https://{cleaned}'


def extract_host(value):
    origin = normalize_origin(value)
    return urlparse(origin).netloc if origin else ''


DEBUG = False

frontend_public_url = config('FRONTEND_PUBLIC_URL', default='https://employe-task.up.railway.app')
backend_public_url = config(
    'BACKEND_PUBLIC_URL',
    default='https://employeetaskmanagement-production-eab1.up.railway.app'
)
railway_public_domain = config('RAILWAY_PUBLIC_DOMAIN', default='').strip()

configured_allowed_hosts = split_csv(config('ALLOWED_HOSTS', default='localhost,127.0.0.1'))
derived_allowed_hosts = [
    extract_host(frontend_public_url),
    extract_host(backend_public_url),
    railway_public_domain,
]

ALLOWED_HOSTS = unique(configured_allowed_hosts + derived_allowed_hosts)


# Database
database_url = config('DATABASE_URL', default='')
if database_url:
    DATABASES = {
        'default': dj_database_url.parse(
            database_url,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# Static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'


# CORS / CSRF
CORS_ALLOW_ALL_ORIGINS = config('CORS_ALLOW_ALL_ORIGINS', default=False, cast=bool)
CORS_ALLOW_CREDENTIALS = True

configured_cors_origins = split_csv(config('CORS_ALLOWED_ORIGINS', default=''))
derived_cors_origins = [
    normalize_origin(frontend_public_url),
    normalize_origin(backend_public_url),
    normalize_origin(railway_public_domain),
]
CORS_ALLOWED_ORIGINS = unique(configured_cors_origins + derived_cors_origins)

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_PREFLIGHT_MAX_AGE = 86400
CORS_URLS_REGEX = r'^/api/.*$'
APPEND_SLASH = True

configured_csrf_origins = split_csv(config('CSRF_TRUSTED_ORIGINS', default=''))
CSRF_TRUSTED_ORIGINS = unique(configured_csrf_origins + derived_cors_origins)
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = True


# Security
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'
X_FRAME_OPTIONS = 'DENY'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# Email
EMAIL_BACKEND = config(
    'EMAIL_BACKEND',
    default='django.core.mail.backends.smtp.EmailBackend'
)
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@taskmanager.com')


# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
    },
}
