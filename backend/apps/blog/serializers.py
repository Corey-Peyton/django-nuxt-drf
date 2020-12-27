from rest_framework import serializers

from apps.blog import models


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Post
        fields = "__all__"
