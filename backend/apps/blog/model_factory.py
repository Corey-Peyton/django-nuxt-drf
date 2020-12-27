import factory
from .models import Post


class PostFactory(factory.Factory):
    class Meta:
        model = Post

    title = factory.Faker('sentence', nb_words=4)
    body = factory.Faker('text')