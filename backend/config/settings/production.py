from .base import *
from decouple import config
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = ['*']

# -------------------------------------------------------------------
# DATABASE
# -------------------------------------------------------------------
DATABASES = {
    'default': dj_database_url.config(
        default=config(
            'DATABASE_URL',
            default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
        ),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# -------------------------------------------------------------------
# MIDDLEWARE (Ultimate Order)
# -------------------------------------------------------------------
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

# -------------------------------------------------------------------
# STATIC FILES
# -------------------------------------------------------------------
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# -------------------------------------------------------------------
# CORS SETTINGS (Ultra Permissive)
# -------------------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = []

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
CORS_URLS_REGEX = r'^.*$'
APPEND_SLASH = False

# -------------------------------------------------------------------
# CSRF SETTINGS
# -------------------------------------------------------------------
CSRF_TRUSTED_ORIGINS = [
    "https://*.up.railway.app",
]
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = True

# -------------------------------------------------------------------
# SECURITY SETTINGS
# -------------------------------------------------------------------
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'

# SECURE_SSL_REDIRECT = False (Let Railway handle HTTPS termination)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# -------------------------------------------------------------------
# EMAIL
# -------------------------------------------------------------------
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@taskmanager.com')
