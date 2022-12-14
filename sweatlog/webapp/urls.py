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
    path("sessions/", views.sessions),
    path("sessions/<int:session_id>/", views.sessions_with_id),
    path("workouts/", views.workouts),
    path("workouts/<int:workout_id>/", views.workouts_with_id),
    path("blocks/", views.blocks),
    # user based paths
    path("users/", views.users),
    path("users/login/", views.login_user),
    path("users/login2/", views.login_user_2),
    path("users/logout/", views.logout_user),
    path("users/get_user_email/", views.get_user_email),
    # new url pattern following REST
    path("users/<int:user_id>/exercisetypes/", views.exercise_types_new),
    path("users/<int:user_id>/equipmenttypes/", views.equipment_types_new),
    path("users/<int:user_id>/exercises/", views.exercises_new),
    path("users/<int:user_id>/blocks/", views.blocks_new),
    path("users/<int:user_id>/workouts/", views.workouts_new),
    path("users/<int:user_id>/sessions/", views.sessions_new),
    path(
        "users/<int:user_id>/exercises/<int:exercise_id>/", views.exercises_new_with_id
    ),
    path(
        "users/<int:user_id>/exercisetypes/<int:exercise_type_id>/",
        views.exercise_types_new_with_id,
    ),
    path(
        "users/<int:user_id>/equipmenttypes/<int:equipment_type_id>/",
        views.equipment_types_new_with_id,
    ),
    path(
        "users/<int:user_id>/sessions/<int:session_id>/",
        views.sessions_new_with_id,
    ),
    # test
    # url
    path("test_url/", views.render_template),
]
