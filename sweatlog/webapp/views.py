from django.shortcuts import render
from django.http.response import HttpResponseBadRequest
from django.http import HttpResponse
from django.http import JsonResponse
from django.db import IntegrityError
from django.utils import timezone
from django.forms.models import model_to_dict
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login


from .models import (
    User,
    Detail,
    Exercise,
    Workout,
    Session,
    EquipmentType,
    ExerciseType,
)

from datetime import datetime
import json


def _find_data(request):
    """return dictionary of get/post data based on request content type"""
    if request.method in ("POST", "DELETE", "PUT"):
        content_type = request.headers.get("Content-Type", None)
        if content_type == "application/json":
            data = json.loads(request.body)
        else:
            data = request.POST
        return data
    # if GET
    else:
        if "json" in request.GET:
            data = json.loads(request.GET["json"])
        else:
            data = request.GET
        return data


#########################################################################################################


def users(request):
    data = _find_data(request)
    if request.method == "POST":
        email = data.get("email", False).lower()
        password = data.get("password", False)
        if not email:
            return HttpResponseBadRequest("email is required")
        if not password:
            return HttpResponseBadRequest("password is required")

        # default usernames to email provided, all lowercase
        try:
            user = User.objects.create(username=email, email=email, password=password)
            request.session["user_token"] = str(user.token)
            return JsonResponse(
                {
                    "email": user.email,
                    "token": user.token,
                    "message": "user successfully created!",
                }
            )
        # we already have this email
        except IntegrityError:
            return JsonResponse(
                {
                    "email": email,
                },
                status=409,
            )


def login_user(request):
    data = _find_data(request)
    if request.method == "POST":
        email = data.get("email", False).lower()
        password = data.get("password", False)
        if not email:
            return HttpResponseBadRequest("email is required")
        if not password:
            return HttpResponseBadRequest("password is required")
    try:
        user = User.objects.get(username=email, password=password)
        request.session["user_token"] = str(user.token)
        return JsonResponse({"email": email, "token": user.token}, status=200)
    except User.DoesNotExist:
        return JsonResponse({}, status=404)
    except PermissionError:
        return JsonResponse({"email": email}, status=403)


def logout_user(request):
    # deletes all session data, including user info
    request.session.flush()
    print(request.session.items())
    return JsonResponse({"message": "user has been logged out"})


# gets user email to persist despite refreshes (where the data would clear out)
def get_user_email(request):
    if request.session.get("user_token") is not None:
        user_token = request.session.get("user_token")
        try:
            user = User.objects.get(token=user_token)
            return JsonResponse(
                {"email": user.email, "token": user.token, "message": "success!"},
                status=200,
            )
        except User.DoesNotExist:
            return JsonResponse({"message": "cannot find user"}, status=404)
    else:
        return JsonResponse({"message": "user token not available"})


def exercise_types(request):
    data = _find_data(request)
    if request.method == "GET":

        all_exercise_types = ExerciseType.objects.all().order_by("id")

        detail = []
        for exercise_type in all_exercise_types:
            detail.append(exercise_type.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"all_exercise_types": detail}, status=200)

    if request.method == "POST":
        name = data.get("name", "").lower()
        exercise_type = ExerciseType.objects.create(name=name)
        return JsonResponse({"exercise_type_id": exercise_type.id}, status=201)


def exercise_types_with_id(request, exercise_type_id):
    data = _find_data(request)
    try:
        exercise_type = ExerciseType.objects.get(id=exercise_type_id)
    except ExerciseType.DoesNotExist:
        return JsonResponse({"message": "exercise type does not exist"}, status=404)

    # get a single exercisetype
    if request.method == "GET":
        detail = exercise_type.serialize(detail_level=Detail.DETAIL)
        return JsonResponse({"exercise_type": detail}, status=200)

    # edit an exercisetype
    if request.method == "PUT":
        exercise_type.name = data.get("name", "").lower()
        exercise_type.save()
        return JsonResponse({"exercise_type_id": exercise_type.id}, status=200)

    # delete an exercisetype
    if request.method == "DELETE":
        exercise_type.delete()
        return JsonResponse(
            {"message": f"exercise type {exercise_type_id} has been deleted"},
            status=202,
        )


def equipment_types(request):
    data = _find_data(request)
    if request.method == "GET":
        all_equipment_types = EquipmentType.objects.all().order_by("id")

        detail = []
        for equipment_type in all_equipment_types:
            detail.append(equipment_type.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"all_equipment_types": detail}, status=200)


def equipment_types_with_id(request, equipment_type_id):
    pass


def exercises(request):
    data = _find_data(request)
    print(data)

    # obtain user info from token, if possible
    user_token = data.get("user_token", "")
    if user_token is ("" or None):
        return JsonResponse({}, status=403)

    # get all exercises
    if request.method == "GET":

        try:
            user = User.objects.get(token=user_token)
        except User.DoesNotExist:
            user = None

        # if there are search params
        # if data:
        #     name_description_search = data.get("name_description_search", "").lower()
        #     equipment_type_id = data.get("equipment_type_id", False)
        #     exercise_type_id = data.get("exercise_type_id", False)

        #     all_exercises = Exercise.objects.filter(
        #         Q(user=None) | Q(user=user)
        #     ).order_by("name")

        #     if name_description_search:
        #         search_list = Exercise.objects.filter(
        #             Q(name__icontains=name_description_search)
        #             | Q(description__icontains=name_description_search)
        #         )

        #     if equipment_type_id is not None:
        #         equipment_type = EquipmentType.objects.get(id=equipment_type_id)
        #         search_list.filter(equipment_type=equipment_type)

        #     if exercise_type_id is not None:
        #         exercise_type = ExerciseType.objects.get(id=exercise_type_id)
        #         search_list.filter(exercise_type=exercise_type)

        #     detail = []
        #     for exercise in search_list:
        #         detail.append(exercise.serialize(detail_level=Detail.DETAIL))

        #     return JsonResponse({"all_exercises": detail}, status=200)

        # if there are no params passed into data, get all exercises
        else:
            all_exercises = Exercise.objects.filter(
                Q(user=None) | Q(user=user)
            ).order_by("name")

            detail = []
            for exercise in all_exercises:
                detail.append(exercise.serialize(detail_level=Detail.DETAIL))

            return JsonResponse({"all_exercises": detail}, status=200)

    # create a new exercise, only if valid user!
    if request.method == "POST":
        user = get_object_or_404(User, token=user_token)

        name = data.get("name", "").lower()
        if not name:
            return HttpResponseBadRequest("name is required")
        equipment_type_id = data.get("equipment_type_id", False)
        exercise_type_id = data.get("exercise_type_id", False)
        description = data.get("description", False)

        # process equipment type
        if equipment_type_id is not None:
            equipment_type = EquipmentType.objects.get(id=equipment_type_id)
        elif equipment_type_id is None:
            equipment_type = None

        # process exercise type
        if exercise_type_id is not None:
            exercise_type = ExerciseType.objects.get(id=exercise_type_id)
        elif exercise_type_id is None:
            exercise_type = None

        exercise = Exercise.objects.create(
            user=user,
            name=name,
            equipment_type=equipment_type,
            exercise_type=exercise_type,
            description=description,
        )
        return JsonResponse({"exercise_id": exercise.id}, status=201)


def exercises_with_id(request, exercise_id):
    data = _find_data(request)

    exercise = get_object_or_404(Exercise, id=exercise_id)

    # get a single exercise
    if request.method == "GET":
        detail = exercise.serialize(detail_level=Detail.DETAIL)
        return JsonResponse({"exercise": detail}, status=200)

    # this data is noly needed for modify or delete
    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    # modify a preexisting exercise
    if request.method == "PUT":

        # if user has permission to modify this entry
        if exercise.user == user:

            equipment_type_id = data.get("equipment_type_id", False)
            exercise_type_id = data.get("exercise_type_id", False)

            exercise.name = data.get("name", "").lower()
            exercise.description = data.get("description", False)

            # process equipment type
            if equipment_type_id is not None:
                equipment_type = EquipmentType.objects.get(id=equipment_type_id)
            elif equipment_type_id is None:
                equipment_type = None

            # process exercise type
            if exercise_type_id is not None:
                exercise_type = ExerciseType.objects.get(id=exercise_type_id)
            elif exercise_type_id is None:
                exercise_type = None

            exercise.equipment_type = equipment_type
            exercise.exercise_type = exercise_type

            exercise.save()

            return JsonResponse({"exercise_id": exercise.id}, status=200)

        else:
            return JsonResponse({"message": "change unsuccessful"})

    # delete a single exercise
    if request.method == "DELETE":

        # if user has permission to delete this entry
        if exercise.user == user:

            exercise.delete()
            return JsonResponse(
                {"message": f"exercise {exercise_id} has been deleted"}, status=202
            )
        else:
            return JsonResponse({"message": "delete unsuccessful"})


def get_all_workout_templates(request):
    data = _find_data(request)
    if request.method == "GET":
        all_workout_templates = (
            Workout.objects.all().filter(template=None).order_by("-date_modified")
        )
        if len(all_workout_templates) < 1:
            return JsonResponse({"message": "no workouts yet!"}, status=404)

        detail = []
        for workout in all_workout_templates:
            detail.append(workout.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"all_workout_templates": detail}, status=200)


def get_scheduled_sessions(request):
    data = _find_data(request)
    if request.method == "GET":
        today = timezone.now()
        scheduled_sessions = Session.objects.filter(date__gte=today).order_by("date")

        if len(scheduled_sessions) < 1:
            return JsonResponse({"message": "no scheduled sessions"}, status=404)

        detail = []
        for session in scheduled_sessions:
            detail.append(session.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"scheduled_sessions": detail}, status=200)
