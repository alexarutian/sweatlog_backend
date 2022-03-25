from django.urls import path

from . import views

app_name = "vue_app"
urlpatterns = [
    path("site/", views.vue_index, name="site"),
]
