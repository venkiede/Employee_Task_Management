from .base import *

DEBUG = True

# Use SQLite for local development by default, or you can configure postgres here
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email backend for development - prints to console
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
