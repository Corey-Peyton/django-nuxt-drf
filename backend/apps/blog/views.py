from django.shortcuts import render

from rest_framework import viewsets

from .models import Post
from .serializers import PostSerializer

# Create your views here.


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = []
