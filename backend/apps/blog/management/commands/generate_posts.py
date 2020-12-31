from django.core.management.base import BaseCommand

from apps.blog.model_factory import PostFactory


class Command(BaseCommand):

    help = 'Generate some fake blog posts using faker'

    def handle(self, *args, **options):
        print("Generating fake posts")
        for _ in range(200):
            post = PostFactory()
            post.save()
