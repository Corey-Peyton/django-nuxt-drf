from django.urls import path

from . import views

urlpatterns = [
    path('account/', views.Profile.as_view(), name='user-profile'),
    path("login/", views.login_view, name="login-view"),
    path("login-set-cookie/", views.login_set_cookie, name="login-view"),
    path("logout/", views.logout_view, name="logout-view"),
]
