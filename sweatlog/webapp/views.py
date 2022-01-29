from django.shortcuts import render
from django.http import HttpResponse

from .models import Exercise


def index(request):
    all_exercises = Exercise.objects.all()
    context = {"all_exercises": all_exercises}
    return render(request, "webapp/index.html", context)


def workout_detail(request, workout_id):
    return HttpResponse("You're looking at the details of workout %s" % workout_id)


def exercise_detail(request, exercise_id):
    try:
        exercise = Exercise.objects.get(id=exercise_id)
    except Exercise.DoesNotExist:
        return HttpResponse(status=404)
    return render(request, "webapp/exercisedetail.html", {"exercise": exercise})
