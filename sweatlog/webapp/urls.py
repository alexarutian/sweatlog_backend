from django.urls import path

from . import views

app_name = "webapp"
urlpatterns = [
    # new URL patterns
    path("exercises/", views.exercises),
    path("exercises/<int:exercise_id>/", views.exercises_with_id),
    path("equipmenttypes/", views.equipment_types),
    path("equipmenttypes/<int:equipment_type_id>/", views.equipment_types_with_id),
    path("exercisetypes/", views.exercise_types),
    path("exercisetypes/<int:exercise_type_id>/", views.exercise_types_with_id),
    # old URL patterns
    path("get_all_workout_templates/", views.get_all_workout_templates),
    path("get_scheduled_sessions/", views.get_scheduled_sessions),
    path("users/", views.users),
    path("users/login/", views.login_user),
    path("users/logout/", views.logout_user),
    path("users/get_user_email/", views.get_user_email),
]
