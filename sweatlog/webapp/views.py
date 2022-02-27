from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.forms.models import model_to_dict


from .models import Detail, Exercise, Workout, WorkoutBlock

import json


def _find_data(request):
    """return dictionary of get/post data based on request content type"""
    if request.method == "POST":
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


def exercises(request):
    all_exercises = Exercise.objects.all()
    context = {"all_exercises": all_exercises}
    return render(request, "webapp/exercises.html", context)


# eventually change to most recent ten workouts?
def workouts(request):
    all_workouts = Workout.objects.all()
    context = {"all_workouts": all_workouts}
    return render(request, "webapp/workouts.html", context)


def workout_detail(request, workout_id):
    try:
        workout = Workout.objects.get(id=workout_id)
        workoutblocks = workout.workoutblocks.all()
    except Workout.DoesNotExist:
        return HttpResponse(status=404)
    context = {"workout": workout, "workoutblocks": workoutblocks}
    return render(request, "webapp/workoutdetail.html", context)


def exercise_detail(request, exercise_id):
    try:
        exercise = Exercise.objects.get(id=exercise_id)
    except Exercise.DoesNotExist:
        return HttpResponse(status=404)
    return render(request, "webapp/exercisedetail.html", {"exercise": exercise})


def get_all_workouts_summary(request):
    data = _find_data(request)
    if request.method == "GET":
        all_workouts = Workout.objects.all().order_by("-date")

        if len(all_workouts) < 1:
            return JsonResponse({"message": "no workouts yet!"}, status=404)

        all_workouts_summary = []
        for workout in all_workouts:
            all_workouts_summary.append(workout.serialize())

        return JsonResponse({"all_workouts_summary": all_workouts_summary}, status=200)


def get_all_workouts_detail(request):
    data = _find_data(request)
    if request.method == "GET":
        all_workouts = Workout.objects.all().order_by("-date")

        if len(all_workouts) < 1:
            return JsonResponse({"message": "no workouts yet!"}, status=404)

        all_workouts_detail = []
        for workout in all_workouts:
            all_workouts_detail.append(workout.serialize(detail_level=Detail.DETAIL))

        return JsonResponse({"all_workouts_detail": all_workouts_detail}, status=200)
