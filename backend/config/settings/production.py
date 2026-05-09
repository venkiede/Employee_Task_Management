from .base import *
from decouple import config
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='*',
    cast=lambda v: [s.strip() for s in v.split(',')]
)

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
# MIDDLEWARE — CorsMiddleware MUST be absolutely first
# Redefine here to ensure correct order even if base.py changes
# -------------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',              # ← MUST be #1
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
# CORS SETTINGS
# Explicitly clear CORS_ALLOWED_ORIGINS from base.py so it does NOT
# conflict with CORS_ALLOW_ALL_ORIGINS = True.
# django-cors-headers skips origin checking when CORS_ALLOW_ALL_ORIGINS
# is True, but having CORS_ALLOWED_ORIGINS set can cause confusion.
# -------------------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True           # Allow all origins in production
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = []               # Cleared — CORS_ALLOW_ALL_ORIGINS takes precedence

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
CORS_URLS_REGEX = r'^.*$'              # Apply CORS to ALL URL patterns

APPEND_SLASH = False

# -------------------------------------------------------------------
# CSRF SETTINGS
# -------------------------------------------------------------------
CSRF_TRUSTED_ORIGINS = [
    "https://athletic-comfort-production-bc5d.up.railway.app",
    "https://*.up.railway.app",
]

# -------------------------------------------------------------------
# SECURITY SETTINGS
# -------------------------------------------------------------------
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

X_FRAME_OPTIONS = 'DENY'

SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# -------------------------------------------------------------------
# EMAIL
# -------------------------------------------------------------------
EMAIL_BACKEND = config(
    'EMAIL_BACKEND',
    default='django.core.mail.backends.smtp.EmailBackend'
)

EMAIL_HOST = config(
    'EMAIL_HOST',
    default='smtp.gmail.com'
)

EMAIL_PORT = config(
    'EMAIL_PORT',
    default=587,
    cast=int
)

EMAIL_USE_TLS = config(
    'EMAIL_USE_TLS',
    default=True,
    cast=bool
)

EMAIL_HOST_USER = config(
    'EMAIL_HOST_USER',
    default=''
)

EMAIL_HOST_PASSWORD = config(
    'EMAIL_HOST_PASSWORD',
    default=''
)

DEFAULT_FROM_EMAIL = config(
    'DEFAULT_FROM_EMAIL',
    default='noreply@taskmanager.com'
)
