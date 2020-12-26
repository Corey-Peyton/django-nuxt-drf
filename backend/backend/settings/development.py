from .base import *  # noqa

DEBUG_APPS = ["debug_toolbar", "django_extensions"]

INSTALLED_APPS += DEBUG_APPS

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
] + MIDDLEWARE  # noqa


def show_toolbar(request):
    return True


DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": show_toolbar,
}