from django.db import models

from enum import Enum


class Detail(Enum):
    SEARCH = 1
    SUMMARY = 2
    DETAIL = 3


class NameableMixin:
    def _get_search_dict(self):
        d = {}
        d["name"] = self.name
        d["id"] = self.id
        return d

    def _get_search_dict_default(self):
        if hasattr(self, "get_search_dict"):
            return self.get_search_dict()
        else:
            return self._get_search_dict()

    @property
    def search_dict(self):
        return self._get_search_dict_default()


# A natural key is a tuple of values that can be used to uniquely identify an object instance
# without using the primary key value.
# # use for handling of fixtures by Django - will check to see if there is a get_by_natural_key method
class ExerciseTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


# e.g. Strength, Cardio, Stretching, Other
class ExerciseType(models.Model, NameableMixin):
    name = models.CharField(max_length=100, unique=True)

    objects = ExerciseTypeManager()

    def __str__(self):
        return self.name


class EquipmentTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


# e.g. Barbell, Dumbbell, Machine, Other
class EquipmentType(models.Model, NameableMixin):
    name = models.CharField(max_length=100, unique=True)

    objects = EquipmentTypeManager()

    def __str__(self):
        return self.name


class ExerciseManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class Exercise(models.Model, NameableMixin):
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

    objects = ExerciseManager()

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        d = {}
        if detail_level in (Detail.SEARCH, Detail.SUMMARY):
            d = self.search_dict
        elif detail_level == Detail.DETAIL:
            d["name"] = self.name
            d["id"] = self.id
            d["exercise_type"] = self.exercise_type.name
            d["equipment_type"] = self.equipment_type.name
        return d


class Block(models.Model, NameableMixin):
    name = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        d = {}
        if detail_level in (Detail.SEARCH, Detail.SUMMARY):
            d = self.search_dict
        elif detail_level == Detail.DETAIL:
            d["name"] = self.name
            d["id"] = self.id
            exercises = []
            d["exercises"] = exercises
            for be in self.blockexercises.all():
                bed = {}
                bed["suggested_sets"] = be.suggested_sets
                bed["suggested_reps"] = be.suggested_reps
                bed["suggested_weight_lb"] = be.suggested_weight_lb
                bed["suggested_time_in_seconds"] = be.suggested_time_in_seconds
                bed["exercise"] = be.exercise.serialize(detail_level)
                exercises.append(bed)
        return d


class BlockExercise(models.Model, NameableMixin):
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name="blockexercises"
    )
    exercise = models.ForeignKey(
        Exercise, on_delete=models.CASCADE, related_name="blockexercises"
    )
    suggested_sets = models.IntegerField(null=True, blank=True)
    suggested_reps = models.IntegerField(null=True, blank=True)
    suggested_weight_lb = models.FloatField(null=True, blank=True)
    suggested_time_in_seconds = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.block.name + "-" + self.exercise.name


class Workout(models.Model, NameableMixin):
    name = models.CharField(max_length=200, blank=True)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        d = {}
        if detail_level in (Detail.SEARCH, Detail.SUMMARY):
            d = self.search_dict
        elif detail_level == Detail.DETAIL:
            d["name"] = self.name
            d["id"] = self.id
            blocks = []
            d["blocks"] = blocks
            for wb in self.workoutblocks.all():
                bd = {}
                bd["block"] = wb.block.serialize(detail_level)
                bd["block"]["block_quantity"] = wb.block_quantity
                blocks.append(bd)
        return d


class WorkoutBlock(models.Model, NameableMixin):
    workout = models.ForeignKey(
        Workout, on_delete=models.CASCADE, related_name="workoutblocks"
    )
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name="workoutblocks"
    )
    block_quantity = models.IntegerField(default=1)

    def __str__(self):
        return self.workout.name + "-" + self.block.name


# add index - defaults to 1 -
# interface - just allow person to say yes i finished - creates logs - actuals same as expected
# challenge - how to create a GUI that allows actual different than expected without much work
class WorkoutLog(models.Model, NameableMixin):
    workout = models.ForeignKey(
        Workout, on_delete=models.CASCADE, related_name="workoutlogs"
    )
    blockexercise = models.ForeignKey(
        BlockExercise, on_delete=models.CASCADE, related_name="blockexercises"
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
