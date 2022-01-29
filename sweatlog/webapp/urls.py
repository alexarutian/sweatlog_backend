from django.urls import path

from . import views

app_name = "webapp"
urlpatterns = [
    path("", views.index, name="index"),
    path("exercise/<int:exercise_id>/", views.exercise_detail, name="exercise_detail"),
    path("workout/<int:workout_id>/", views.workout_detail, name="workout_detail"),
]
