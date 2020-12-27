from django.db import models
from apps.core.models import BaseModel

# Create your models here.


class Post(BaseModel):

    title = models.CharField(max_length=200)
    body = models.CharField(max_length=10_000)

    def __str__(self):
        return self.title
