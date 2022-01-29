from django.db import models


class ExerciseType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class EquipmentType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    exercise_type = models.ForeignKey(
        ExerciseType,
        on_delete=models.CASCADE,
        related_name="exercises",
        null=True,
    )
    equipment_type = models.ForeignKey(
        EquipmentType,
        on_delete=models.CASCADE,
        related_name="exercises",
        null=True,
    )

    def __str__(self):
        return self.name


class Block(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class BlockContent(models.Model):
    exercise = models.ForeignKey(
        Exercise, on_delete=models.CASCADE, related_name="blockcontents"
    )
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name="blockcontents"
    )
    suggested_sets = models.IntegerField(null=True)
    suggested_reps = models.IntegerField(null=True)
    suggested_weight_lb = models.FloatField(null=True)
    suggested_time_in_seconds = models.IntegerField(null=True)

    def __str__(self):
        return self.exercise.name + "-" + self.block.name


class Workout(models.Model):
    name = models.CharField(max_length=200, blank=True)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class WorkoutContent(models.Model):
    workout = models.ForeignKey(
        Workout, on_delete=models.CASCADE, related_name="workoutcontents"
    )
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name="workoutcontents"
    )
    block_quantity = models.IntegerField(default=1)

    def __str__(self):
        return self.workout.name + "-" + self.block.name


class WorkoutLog(models.Model):
    workout = models.ForeignKey(
        Workout, on_delete=models.CASCADE, related_name="workoutlogs"
    )
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name="workoutlogs"
    )
    exercise = models.ForeignKey(
        Exercise, on_delete=models.CASCADE, related_name="workoutlogs"
    )
    actual_sets = models.IntegerField(null=True)
    actual_reps = models.IntegerField(null=True)
    actual_weight_lb = models.FloatField(null=True)
    actual_time_in_seconds = models.IntegerField(null=True)
    notes = models.TextField(blank=True)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.workout.name + "-" + self.date
