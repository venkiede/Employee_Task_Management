from .base import *
from decouple import config
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='*',
    cast=lambda v: [s.strip() for s in v.split(',')]
)

# Database configuration
# Use DATABASE_URL for Railway, fallback to sqlite for build time
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
# INSTALLED APPS
# -------------------------------------------------------------------

# Ensure corsheaders is installed
if 'corsheaders' not in INSTALLED_APPS:
    INSTALLED_APPS.insert(0, 'corsheaders')

# -------------------------------------------------------------------
# MIDDLEWARE
# -------------------------------------------------------------------

# Remove existing WhiteNoise middleware if already present
MIDDLEWARE = [
    mw for mw in MIDDLEWARE
    if mw != 'whitenoise.middleware.WhiteNoiseMiddleware'
]

# Remove existing CORS middleware if already present
MIDDLEWARE = [
    mw for mw in MIDDLEWARE
    if mw != 'corsheaders.middleware.CorsMiddleware'
]

# Insert CORS middleware at top
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')

# Insert WhiteNoise after SecurityMiddleware
try:
    security_index = MIDDLEWARE.index(
        'django.middleware.security.SecurityMiddleware'
    )
    MIDDLEWARE.insert(
        security_index + 1,
        'whitenoise.middleware.WhiteNoiseMiddleware'
    )
except ValueError:
    # fallback if SecurityMiddleware missing
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# -------------------------------------------------------------------
# STATIC FILES
# -------------------------------------------------------------------

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# -------------------------------------------------------------------
# CORS & CSRF
# -------------------------------------------------------------------

# Explicit frontend origin
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://athletic-comfort-production-bc5d.up.railway.app",
]

# Allow cookies/auth headers if needed
CORS_ALLOW_CREDENTIALS = True

# Trusted CSRF origins
CSRF_TRUSTED_ORIGINS = [
    "https://athletic-comfort-production-bc5d.up.railway.app",
    "https://*.up.railway.app",
]

# Explicitly allow headers for JWT/Auth
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

# Explicitly allow methods
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
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
