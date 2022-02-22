from django.urls import path

from . import views

app_name = "webapp"
urlpatterns = [
    path("exercises/", views.exercises, name="exercises"),
    path("workouts/", views.workouts, name="workouts"),
    path("exercise/<int:exercise_id>/", views.exercise_detail, name="exercise_detail"),
    path("workout/<int:workout_id>/", views.workout_detail, name="workout_detail"),
]
