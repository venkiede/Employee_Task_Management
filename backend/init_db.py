import os
import django

# Set settings to production
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
django.setup()

from django.core.management import call_command
from accounts.models import User


def initialize():
    try:
        print("--- Database Initialization Start ---")

        # 1. Run Migrations
        print("Step 1: Running migrations...")
        call_command('migrate', interactive=False)

        # 2. Create Admin if missing
        print("Step 2: Checking for admin user...")
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'Admin123!')
        admin_full_name = os.environ.get('ADMIN_FULL_NAME', 'System Admin')
        if not User.objects.filter(email=admin_email).exists():
            print(f"Creating admin user: {admin_email}")
            User.objects.create_superuser(
                email=admin_email,
                password=admin_password,
                full_name=admin_full_name
            )
            print("SUCCESS: Admin user created.")
        else:
            print("INFO: Admin user already exists.")

        print("--- Database Initialization Complete ---")
    except Exception as e:
        print(f"ERROR during initialization: {e}")
        raise

if __name__ == "__main__":
    initialize()
