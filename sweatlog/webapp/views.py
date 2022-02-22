from django.shortcuts import render
from django.http import HttpResponse

from .models import Exercise, Workout


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
