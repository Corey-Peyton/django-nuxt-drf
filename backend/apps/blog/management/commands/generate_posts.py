from django.core.management.base import BaseCommand

from apps.blog.models import Post
from apps.blog.model_factory import PostFactory


class Command(BaseCommand):

    help = 'Generate some fake blog posts using faker'

    def handle(self, *args, **options):
        if not Post.objects.exists():
            print("Generating 200 posts...")
            for _ in range(200):
                post = PostFactory()
                post.save()
        else:
            print("Posts already exist, not generating any.")
