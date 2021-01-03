from django.contrib import admin

# Register your models here.

from .models import Post


class PostAdmin(admin.ModelAdmin):
    list_display = ('created_by', 'title', 'created_on')

    class Meta:
        model = Post
        fields = "__all__"


admin.site.register(Post, PostAdmin)
