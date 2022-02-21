from django.db import models

# A natural key is a tuple of values that can be used to uniquely identify an object instance without using the primary key value.
# # use for handling of fixtures by Django - will check to see if there is a get_by_natural_key method


class ExerciseTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class ExerciseType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    objects = ExerciseTypeManager()

    def __str__(self):
        return self.name


class EquipmentTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class EquipmentType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    objects = EquipmentTypeManager()

    def __str__(self):
        return self.name


class Exercise(models.Model):
    name = models.CharField(max_length=100, unique=True)
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
    suggested_sets = models.IntegerField(null=True, blank=True)
    suggested_reps = models.IntegerField(null=True, blank=True)
    suggested_weight_lb = models.FloatField(null=True, blank=True)
    suggested_time_in_seconds = models.IntegerField(null=True, blank=True)

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
    actual_sets = models.IntegerField(null=True, blank=True)
    actual_reps = models.IntegerField(null=True, blank=True)
    actual_weight_lb = models.FloatField(null=True, blank=True)
    actual_time_in_seconds = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    date = models.DateTimeField(auto_now=True)

    # add date logic to this later
    def __str__(self):
        return self.workout.name
