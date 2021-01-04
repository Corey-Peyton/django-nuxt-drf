from django.core.management.base import BaseCommand

from django.contrib.auth import get_user_model

PASSWORD = "password"
User = get_user_model()


class Command(BaseCommand):
    help = "Generate a superuser and users for seeding data"

    def handle(self, *args, **options):
        if not User.objects.filter(is_superuser=True).exists():
            print("Creating default user")
            User.objects.create_superuser(
                email="admin@company.com", password=PASSWORD,
            )
            print(
                """
                Superuser created:
                email: 'admin@company.com'
                """
            )
        else:
            print("A superuser already exists, not creating one")
        if not User.objects.filter(is_superuser=False).exists():
            print("Creating regular users")
            for i in range(5):
                User.objects.create_user(
                    email=f"user_{i}@email.com", password=PASSWORD
                )
            print(
                """
                Regular users created:
                email: 'user_{0..4}@company.com'
                """
            )
        else:
            print("Regular users already exist, not creating any")
