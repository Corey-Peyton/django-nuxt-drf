from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Generate superusers, users and posts"

    def handle(self, *args, **options):
        call_command('migrate')
        print("Seeding database...")
        call_command('create_users')
        call_command('generate_posts')
