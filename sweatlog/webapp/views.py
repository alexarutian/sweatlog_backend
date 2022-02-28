from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone
from django.forms.models import model_to_dict


from .models import Detail, Exercise, Workout, Session

from datetime import datetime
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
