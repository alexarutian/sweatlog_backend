from django.shortcuts import render
from django.http.response import HttpResponseBadRequest
from django.http import JsonResponse
from django.db import IntegrityError, connection, reset_queries
from django.utils import timezone
from django.forms.models import model_to_dict
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.gzip import gzip_page


from .models import (
    User,
    Detail,
    Exercise,
    Workout,
    Session,
    EquipmentType,
    ExerciseType,
    Block,
    Stat,
    BlockExercise,
    WorkoutBlock,
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


@csrf_exempt
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
            user = User.objects.create_user(email, email, password)
            request.session["user_token"] = str(user.token)
            return JsonResponse(
                {
                    "email": user.email,
                    "token": user.token,
                    "id": user.id,
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
    # try:
    #     user = User.objects.get(email=email, password=password)
    #     request.session["user_token"] = str(user.token)
    user = authenticate(username=email, password=password)
    if user is not None:
        request.session["user_token"] = str(user.token)
        return JsonResponse({"email": email, "token": user.token}, status=200)
    else:
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({}, status=404)
        return JsonResponse({}, status=403)


@csrf_exempt
def login_user_2(request):
    data = _find_data(request)
    if request.method == "POST":
        email = data.get("email", False).lower()
        password = data.get("password", False)
        if not email:
            return HttpResponseBadRequest("email is required")
        if not password:
            return HttpResponseBadRequest("password is required")

    # try:
    #     user = User.objects.get(email=email, password=password)
    #     request.session["user_token"] = str(user.token)
    user = authenticate(username=email, password=password)
    if user is not None:
        # request.session["user_token"] = str(user.token)
        return JsonResponse(
            {"email": email, "token": user.token, "id": user.id}, status=200
        )
    else:
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({}, status=404)
        return JsonResponse({}, status=403)


def logout_user(request):
    # deletes all session data, including user info
    request.session.flush()
    return JsonResponse({"message": "user has been logged out"})


# gets user email to persist despite refreshes (where the data would clear out)
def get_user_email(request):
    if request.session.get("user_token") is not None:
        user_token = request.session.get("user_token")
        try:
            user = User.objects.get(token=user_token)
            return JsonResponse(
                {"email": user.email, "token": user.token},
                status=200,
            )
        except User.DoesNotExist:
            return JsonResponse({}, status=404)
    else:
        return JsonResponse({"message": "user token not available"})


@csrf_exempt
def exercise_types_new(request, user_id):
    data = _find_data(request)
    requestor_token = data.get("user_token", False)
    requestor = get_object_or_404(User, token=requestor_token)
    user = get_object_or_404(User, id=user_id)
    requestor_has_permission = requestor.is_superuser or requestor == user

    if request.method == "POST" and requestor_has_permission:

        name = data.get("name", "").lower()
        if not name:
            return HttpResponseBadRequest("name is required")

        try:
            exercise_type = ExerciseType.objects.create(
                user=user,
                name=name,
            )
            return JsonResponse({"exercise_type_id": exercise_type.id}, status=201)
        except IntegrityError:
            return JsonResponse({}, status=409)


@csrf_exempt
def exercise_types_new_with_id(request, user_id, exercise_type_id):
    data = _find_data(request)
    requestor_token = data.get("user_token", False)
    requestor = get_object_or_404(User, token=requestor_token)
    user = get_object_or_404(User, id=user_id)
    requestor_has_permission = requestor.is_superuser or requestor == user

    exercise_type = get_object_or_404(ExerciseType, id=exercise_type_id)

    if request.method == "PUT" and requestor_has_permission:
        exercise_type.name = data.get("name", "").lower()
        exercise_type.save()
        return JsonResponse({"exercise_type_id": exercise_type.id}, status=200)

    if request.method == "DELETE" and requestor_has_permission:
        exercise_type.delete()
        return JsonResponse(
            {"message": f"exercise {exercise_type_id} has been deleted"}, status=202
        )
    else:
        return JsonResponse({"message": "cannot modify this exercise type"}, status=403)


def exercise_types(request):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    if request.method == "GET":

        all_exercise_types = ExerciseType.objects.filter(user=user).order_by("id")

        detail = []
        for exercise_type in all_exercise_types:
            detail.append(exercise_type.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"all_exercise_types": detail}, status=200)

    if request.method == "POST":
        name = data.get("name", "").lower()
        exercise_type = ExerciseType.objects.create(name=name, user=user)
        return JsonResponse({"exercise_type_id": exercise_type.id}, status=201)


def exercise_types_with_id(request, exercise_type_id):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

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
        exercise_type.user = user
        exercise_type.save()
        return JsonResponse({"exercise_type_id": exercise_type.id}, status=200)

    # delete an exercisetype
    if request.method == "DELETE":
        if exercise_type.user == user:
            exercise_type.delete()
            return JsonResponse(
                {"message": f"exercise type {exercise_type_id} has been deleted"},
                status=202,
            )
        else:
            return JsonResponse({"message": "cannot delete this exercise"}, status=403)


@csrf_exempt
def equipment_types_new(request, user_id):
    data = _find_data(request)
    requestor_token = data.get("user_token", False)
    requestor = get_object_or_404(User, token=requestor_token)
    user = get_object_or_404(User, id=user_id)
    requestor_has_permission = requestor.is_superuser or requestor == user

    if request.method == "POST" and requestor_has_permission:

        name = data.get("name", "").lower()
        if not name:
            return HttpResponseBadRequest("name is required")

        try:
            equipment_type = EquipmentType.objects.create(
                user=user,
                name=name,
            )
            return JsonResponse({"equipment_type_id": equipment_type.id}, status=201)
        except IntegrityError:
            return JsonResponse({}, status=409)


@csrf_exempt
def equipment_types_new_with_id(request, user_id, equipment_type_id):
    data = _find_data(request)
    requestor_token = data.get("user_token", False)
    requestor = get_object_or_404(User, token=requestor_token)
    user = get_object_or_404(User, id=user_id)
    requestor_has_permission = requestor.is_superuser or requestor == user

    equipment_type = get_object_or_404(EquipmentType, id=equipment_type_id)

    if request.method == "PUT" and requestor_has_permission:
        equipment_type.name = data.get("name", "").lower()
        equipment_type.save()
        return JsonResponse({"equipment_type_id": equipment_type.id}, status=200)

    if request.method == "DELETE" and requestor_has_permission:
        equipment_type.delete()
        return JsonResponse(
            {"message": f"exercise {equipment_type_id} has been deleted"}, status=202
        )
    else:
        return JsonResponse(
            {"message": "cannot modify this equipment type"}, status=403
        )


def equipment_types(request):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    if request.method == "GET":
        all_equipment_types = EquipmentType.objects.filter(user=user).order_by("id")

        detail = []
        for equipment_type in all_equipment_types:
            detail.append(equipment_type.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"all_equipment_types": detail}, status=200)

    if request.method == "POST":
        name = data.get("name", "").lower()
        equipment_type = EquipmentType.objects.create(name=name, user=user)
        return JsonResponse({"equipment_type_id": equipment_type.id}, status=201)


def equipment_types_with_id(request, equipment_type_id):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    try:
        equipment_type = EquipmentType.objects.get(id=equipment_type_id)
    except EquipmentType.DoesNotExist:
        return JsonResponse({"message": "equipment type does not exist"}, status=404)

    # get a single equipmenttype
    if request.method == "GET":
        detail = equipment_type.serialize(detail_level=Detail.DETAIL)
        return JsonResponse({"equipment_type": detail}, status=200)

    # edit an equipmenttype
    if request.method == "PUT":
        equipment_type.name = data.get("name", "").lower()
        equipment_type.user = user
        equipment_type.save()
        return JsonResponse({"equipment_type_id": equipment_type.id}, status=200)

    # delete an equipmenttype
    if request.method == "DELETE":
        if equipment_type.user == user:
            equipment_type.delete()
            return JsonResponse(
                {"message": f"equipment type {equipment_type_id} has been deleted"},
                status=202,
            )
        else:
            return JsonResponse({"message": "cannot delete this equipment"}, status=403)


@csrf_exempt
def exercises_new(request, user_id):
    data = _find_data(request)
    requestor_token = data.get("user_token", False)
    requestor = get_object_or_404(User, token=requestor_token)

    user = get_object_or_404(User, id=user_id)

    requestor_has_permission = requestor.is_superuser or requestor == user

    if request.method == "GET" and requestor_has_permission:
        reset_queries()

        all_exercises = Exercise.objects.filter(user=user)

        detail = []
        for exercise in all_exercises:
            detail.append(exercise.serialize(detail_level=Detail.MID))

        return JsonResponse(
            {"all_exercises": detail, "queries": list(connection.queries)}, status=200
        )

        # create a new exercise, only if valid user!
    if request.method == "POST" and requestor_has_permission:

        name = data.get("name", "").lower()
        if not name:
            return HttpResponseBadRequest("name is required")
        equipment_type_id = data.get("equipment_type_id", None)
        exercise_type_id = data.get("exercise_type_id", None)
        description = data.get("description", None)

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

        try:
            exercise = Exercise.objects.create(
                user=user,
                name=name,
                equipment_type=equipment_type,
                exercise_type=exercise_type,
                description=description,
            )
            return JsonResponse({"exercise_id": exercise.id}, status=201)
        except IntegrityError:
            return JsonResponse({}, status=409)


@csrf_exempt
def exercises_new_with_id(request, user_id, exercise_id):
    data = _find_data(request)
    requestor_token = data.get("user_token", False)
    requestor = get_object_or_404(User, token=requestor_token)
    user = get_object_or_404(User, id=user_id)
    requestor_has_permission = requestor.is_superuser or requestor == user

    exercise = get_object_or_404(Exercise, id=exercise_id)

    if request.method == "DELETE" and requestor_has_permission:
        exercise.delete()
        return JsonResponse(
            {"message": f"exercise {exercise_id} has been deleted"}, status=202
        )
    else:
        return JsonResponse({"message": "cannot modify this exercise"}, status=403)


def exercises(request):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    # get all exercises
    if request.method == "GET":

        # if there are no params passed into data, get all exercises
        all_exercises = Exercise.objects.filter(user=user).order_by("name")
        # all_exercises = Exercise.objects.order_by("name")

        equipment_type_id = data.get("equipment_type_id", False)
        exercise_type_id = data.get("exercise_type_id", False)

        # process equipment type
        if equipment_type_id is not None:
            equipment_type = EquipmentType.objects.get(id=equipment_type_id)
            all_exercises = all_exercises.filter(equipment_type=equipment_type)

        # process exercise type
        if exercise_type_id is not None:
            exercise_type = ExerciseType.objects.get(id=exercise_type_id)
            all_exercises = all_exercises.filter(exercise_type=exercise_type)

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
        equipment_type_id = data.get("equipment_type_id", None)
        exercise_type_id = data.get("exercise_type_id", None)
        description = data.get("description", None)

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

        try:
            exercise = Exercise.objects.create(
                user=user,
                name=name,
                equipment_type=equipment_type,
                exercise_type=exercise_type,
                description=description,
            )
            return JsonResponse({"exercise_id": exercise.id}, status=201)
        except IntegrityError:
            return JsonResponse({}, status=409)


def exercises_with_id(request, exercise_id):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    exercise = get_object_or_404(Exercise, id=exercise_id)

    # get a single exercise
    if request.method == "GET":
        detail = exercise.serialize(detail_level=Detail.DETAIL)
        return JsonResponse({"exercise": detail}, status=200)

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
            return JsonResponse({"message": "cannot modify this exercise"}, status=403)

    # delete a single exercise
    if request.method == "DELETE":

        # if user has permission to delete this entry
        if exercise.user == user:

            exercise.delete()
            return JsonResponse(
                {"message": f"exercise {exercise_id} has been deleted"}, status=202
            )
        else:
            return JsonResponse({"message": "cannot modify this exercise"}, status=403)


def blocks_new(request, user_id):
    data = _find_data(request)
    user = get_object_or_404(User, id=user_id)

    if request.method == "GET":
        reset_queries()
        all_blocks = Block.objects.filter(user=user).prefetch_related(
            "blockexercises__exercise__equipment_type",
            "blockexercises__exercise__exercise_type",
            "blockexercises__stat",
        )

        detail = []
        for block in all_blocks:
            block_detail = block.serialize(detail_level=Detail.MID)
            if block_detail not in detail:
                detail.append(block_detail)

        return JsonResponse(
            {"all_blocks": detail, "queries": list(connection.queries)}, status=200
        )


def blocks(request):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    if request.method == "GET":
        all_blocks = Block.objects.filter(user=user).order_by("-date_modified")

        if len(all_blocks) < 1:
            return JsonResponse({"message": "no blocks yet!"}, status=404)

        detail = []
        for workout in all_blocks:
            detail.append(workout.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"all_blocks": detail}, status=200)

    if request.method == "POST":

        # create block
        name = data.get("name", "").lower()
        block = Block.objects.create(name=name, user=user)

        # post to blockexercise
        exercise_list = data.get("exercise_list", [])
        e_order = 0
        for e in exercise_list:
            e_order += 1
            e_id = e["id"]
            e_sets = e.get("sets")
            e_reps = e.get("reps")
            e_weight_lb = e.get("weight_lb")
            e_time_in_seconds = e.get("time_in_seconds")

            exercise = get_object_or_404(Exercise, id=e_id)

            # create a stat
            if e_sets or e_reps or e_weight_lb or e_time_in_seconds:
                stat = Stat.objects.create(
                    sets=e_sets,
                    reps=e_reps,
                    weight_lb=e_weight_lb,
                    time_in_seconds=e_time_in_seconds,
                )
            else:
                stat = None

            BlockExercise.objects.create(
                block=block, exercise=exercise, stat=stat, exercise_order=e_order
            )

        return JsonResponse({"block_id": block.id}, status=201)


@gzip_page
def workouts_new(request, user_id):
    data = _find_data(request)
    user = get_object_or_404(User, id=user_id)

    if request.method == "GET":
        reset_queries()
        all_workouts_info = (
            Workout.objects.filter(user=user)
            .prefetch_related(
                "workoutblocks__block__blockexercises__exercise__equipment_type",
                "workoutblocks__block__blockexercises__exercise__exercise_type",
                "workoutblocks__block__blockexercises__stat",
            )
            .distinct()
        )

        detail = []
        for workout in all_workouts_info:
            # not a real detailed level
            workout_detail = workout.serialize(detail_level=Detail.MID)
            detail.append(workout_detail)

        return JsonResponse(
            {"all_workouts": detail, "queries": list(connection.queries)}, status=200
        )


def render_template(request):
    return render(request, "webapp/test.html")


def workouts(request):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    if request.method == "GET":
        all_workouts = Workout.objects.filter(user=user).order_by("-date_modified")

        if len(all_workouts) < 1:
            return JsonResponse({"message": "no workouts yet!"}, status=404)

        detail = []
        for workout in all_workouts:
            detail.append(workout.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"all_workouts": detail}, status=200)

    if request.method == "POST":

        # create workout
        name = data.get("name", "").lower()
        workout = Workout.objects.create(name=name, user=user)

        # process each block in item_list
        item_list = data.get("item_list", [])
        b_order = 0
        for b in item_list:
            b_order += 1
            b_name = b.get("name", "").lower()
            b_quantity = b.get("quantity")

            block = Block.objects.create(name=b_name, user=user)
            WorkoutBlock.objects.create(
                workout=workout,
                block=block,
                block_quantity=b_quantity,
                block_order=b_order,
            )

            # process exercise list within the block
            exercise_list = b.get("exercise_list", [])
            e_order = 0
            for e in exercise_list:
                e_order += 1
                e_id = e["id"]
                e_sets = e.get("sets")
                e_reps = e.get("reps")
                e_weight_lb = e.get("weight_lb")
                e_time_in_seconds = e.get("time_in_seconds")

                exercise = get_object_or_404(Exercise, id=e_id)

                # create a stat
                if e_sets or e_reps or e_weight_lb or e_time_in_seconds:
                    stat = Stat.objects.create(
                        sets=e_sets,
                        reps=e_reps,
                        weight_lb=e_weight_lb,
                        time_in_seconds=e_time_in_seconds,
                    )
                else:
                    stat = None

                BlockExercise.objects.create(
                    block=block, exercise=exercise, stat=stat, exercise_order=e_order
                )

        return JsonResponse({"workout_id": workout.id}, status=201)


def workouts_with_id(request, workout_id):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    workout = get_object_or_404(Workout, id=workout_id)

    # get a single session
    if request.method == "GET":
        detail = workout.serialize(detail_level=Detail.DETAIL)
        return JsonResponse({"workout": detail}, status=200)

    # modify a preexisting workout
    # WORK MORE ON THIS
    if request.method == "PUT":

        # if user has permission to modify this entry
        if workout.user == user:

            # create workout
            name = data.get("name", "").lower()
            workout_new = Workout.objects.create(name=name, user=user)

            # set old workout to reference new workout
            workout.updated_by = workout_new
            workout.save()

            # process each block in item_list
            item_list = data.get("item_list", [])
            b_order = 0
            for b in item_list:
                b_order += 1
                b_name = b.get("name", "").lower()
                b_quantity = b.get("quantity")

                block_new = Block.objects.create(name=b_name, user=user)
                WorkoutBlock.objects.create(
                    workout=workout_new,
                    block=block_new,
                    block_quantity=b_quantity,
                    block_order=b_order,
                )

                # process exercise list within the block
                exercise_list = b.get("exercise_list", [])
                e_order = 0
                for e in exercise_list:
                    e_order += 1
                    e_id = e["id"]
                    e_sets = e.get("sets")
                    e_reps = e.get("reps")
                    e_weight_lb = e.get("weight_lb")
                    e_time_in_seconds = e.get("time_in_seconds")

                    exercise = get_object_or_404(Exercise, id=e_id)

                    # create a stat
                    if e_sets or e_reps or e_weight_lb or e_time_in_seconds:
                        stat = Stat.objects.create(
                            sets=e_sets,
                            reps=e_reps,
                            weight_lb=e_weight_lb,
                            time_in_seconds=e_time_in_seconds,
                        )
                    else:
                        stat = None

                    BlockExercise.objects.create(
                        block=block,
                        exercise=exercise,
                        stat=stat,
                        exercise_order=e_order,
                    )

            return JsonResponse({"workout_id": workout_new.id}, status=201)

    # delete a single workout
    if request.method == "DELETE":

        # if user has permission to delete this entry
        if workout.user == user:

            workout.delete()
            return JsonResponse(
                {"message": f"workout {workout_id} has been deleted"}, status=202
            )
        else:
            return JsonResponse({"message": "cannot modify this workout"}, status=403)


def sessions_new(request, user_id):
    data = _find_data(request)
    requestor_token = data.get("user_token", False)
    requestor = get_object_or_404(User, token=requestor_token)

    user = get_object_or_404(User, id=user_id)

    requestor_has_permission = requestor.is_superuser or requestor == user

    if request.method == "GET" and requestor_has_permission:
        reset_queries()
        all_sessions_info = Session.objects.filter(workout__user=user).prefetch_related(
            "workout__workoutblocks__block",
        )

        detail = []
        for session in all_sessions_info:
            # not a real detailed level
            session_detail = session.serialize(detail_level=Detail.MID)
            if session_detail not in detail:
                detail.append(session_detail)

        return JsonResponse(
            {"all_sessions": detail, "queries": list(connection.queries)}, status=200
        )


def sessions(request):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)
    if request.method == "GET":

        today = timezone.now()
        scheduled_sessions = Session.objects.filter(workout__user=user)
        # breakpoint()
        print(scheduled_sessions)
        # Session.objects.filter(date__gte=today)
        # cannot schedule and use in sessions an example workout!

        if len(scheduled_sessions) < 1:
            return JsonResponse({"message": "no scheduled sessions"}, status=404)

        detail = []
        for session in scheduled_sessions:
            serialized = session.serialize(detail_level=Detail.DETAIL)
            detail.append(serialized)

        return JsonResponse({"scheduled_sessions": detail}, status=200)

    if request.method == "POST":
        date = data.get("date", False)
        workout_id = data.get("workout_id", False)

        workout = get_object_or_404(Workout, id=workout_id)
        session = Session.objects.create(workout=workout, date=date)

        return JsonResponse({"session_id": session.id}, status=201)


def sessions_with_id(request, session_id):
    data = _find_data(request)

    user_token = data.get("user_token", False)
    user = get_object_or_404(User, token=user_token)

    session = get_object_or_404(Session, id=session_id)

    # get a single session
    if request.method == "GET":
        detail = session.serialize(detail_level=Detail.DETAIL)
        return JsonResponse({"session": detail}, status=200)

    # modify a preexisting session
    # WORK MORE ON THIS
    if request.method == "PUT":

        pass

    # delete a single exercise
    if request.method == "DELETE":

        # if user has permission to delete this entry
        if session.workout.user == user:

            session.delete()
            return JsonResponse(
                {"message": f"session {session_id} has been deleted"}, status=202
            )
        else:
            return JsonResponse({"message": "cannot modify this session"}, status=403)
