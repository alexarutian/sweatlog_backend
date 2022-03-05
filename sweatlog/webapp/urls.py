from django.urls import path

from . import views

app_name = "webapp"
urlpatterns = [
    # new URL patterns
    path("exercises/<int:exercise_id>/", views.exercises_with_id),
    path("exercises/", views.exercises),
    # old URL patterns
    path("get_all_workout_templates/", views.get_all_workout_templates),
    path("get_scheduled_sessions/", views.get_scheduled_sessions),
    path("get_all_exercises/", views.get_all_exercises),
    path("get_all_exercise_types/", views.get_all_exercise_types),
    path("get_all_equipment_types/", views.get_all_equipment_types),
    path("create_exercise/", views.create_exercise),
    path("delete_exercise/", views.delete_exercise),
    path("edit_exercise/", views.edit_exercise),
]
