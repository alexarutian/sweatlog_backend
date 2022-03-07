from ast import Name
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import formats

from django.db.models.signals import pre_save
from django.dispatch import receiver

from enum import Enum

import uuid


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_normal_member = models.BooleanField(default=True)
    token = models.UUIDField()

    def __str__(self):
        return self.email

    @classmethod
    def get_token(cls):
        return uuid.uuid4()


# router to listen to models' actions, if function registered will go through hoop first
@receiver(pre_save, sender=User)
def user_saved(sender, instance, *args, **kwargs):
    instance.token = instance.get_token()


class Detail(Enum):
    SEARCH = 1
    SUMMARY = 2
    DETAIL = 3


# CASCADE TO ALL EVENTUALLY
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
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exercisetypes",
        null=True,
    )

    objects = ExerciseTypeManager()

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        d = {}
        if detail_level in (Detail.SUMMARY, Detail.SEARCH, Detail.DETAIL):
            d = self.search_dict
        return d


class EquipmentTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


# e.g. Barbell, Dumbbell, Machine, Other
class EquipmentType(models.Model, NameableMixin):
    name = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="equipmenttypes",
        null=True,
    )

    objects = EquipmentTypeManager()

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        d = {}
        if detail_level in (Detail.SUMMARY, Detail.SEARCH, Detail.DETAIL):
            d = self.search_dict
        return d


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
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
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
            if self.description:
                d["description"] = self.description
            if self.exercise_type:
                d["exercise_type"] = self.exercise_type.serialize()
            if self.equipment_type:
                d["equipment_type"] = self.equipment_type.serialize()
        return d


class Stat(models.Model, NameableMixin):
    sets = models.IntegerField(null=True, blank=True)
    reps = models.IntegerField(null=True, blank=True)
    weight_lb = models.FloatField(null=True, blank=True)
    time_in_seconds = models.IntegerField(null=True, blank=True)

    def get_search_dict(self):
        d = {}
        d["id"] = self.id
        d["sets"] = self.sets
        d["reps"] = self.reps
        d["weight_lb"] = self.weight_lb
        d["time_in_seconds"] = self.time_in_seconds
        return d

    def serialize(self, detail_level=Detail.SUMMARY):
        d = {}
        if detail_level in (Detail.SUMMARY, Detail.SEARCH, Detail.DETAIL):
            d = self.search_dict
        return d


class Block(models.Model, NameableMixin):
    name = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    template = models.ForeignKey("self", on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="blocks",
        null=True,
    )

    @property
    def is_template(self):
        return self.template is None

    def __str__(self):
        if self.is_template:
            return self.name + " [TEMPLATE]"
        else:
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
                bed["exercise"] = be.exercise.serialize(detail_level)
                bed["stats"] = be.stat.serialize()
                bed["exercise_order"] = be.exercise_order
                exercises.append(bed)
        return d


class BlockExercise(models.Model):
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name="blockexercises", null=True
    )
    exercise = models.ForeignKey(
        Exercise, on_delete=models.CASCADE, related_name="blockexercises"
    )
    exercise_order = (
        models.IntegerField()
    )  # order of individual exercises within the block
    stat = models.ForeignKey(
        Stat, on_delete=models.CASCADE, related_name="blockexercises"
    )

    def __str__(self):
        return self.block.name + " - " + self.exercise.name


class Workout(models.Model, NameableMixin):
    name = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    template = models.ForeignKey("self", on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workouts",
        null=True,
    )

    @property
    def is_template(self):
        return self.template is None

    def __str__(self):
        if self.is_template:
            return self.name + " [TEMPLATE]"
        else:
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


class WorkoutBlock(models.Model):
    workout = models.ForeignKey(
        Workout, on_delete=models.CASCADE, related_name="workoutblocks", null=True
    )
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name="workoutblocks", null=True
    )
    block_quantity = models.IntegerField(default=1)
    block_order = models.IntegerField()

    def __str__(self):
        return self.workout.name + " - " + self.block.name


class Session(models.Model, NameableMixin):
    date = models.DateField()
    workout = models.ForeignKey(
        Workout, on_delete=models.CASCADE, related_name="sessions"
    )

    def __str__(self):
        prettyDate = formats.date_format(self.date, "DATE_FORMAT")
        return self.workout.name + " - " + prettyDate

    def get_search_dict(self):
        d = {}
        d["id"] = self.id
        d["date"] = self.date
        d["workout_name"] = self.workout.name
        return d

    def serialize(self, detail_level=Detail.SUMMARY):
        d = {}
        if detail_level in (Detail.SEARCH, Detail.SUMMARY):
            d = self.search_dict
        elif detail_level == Detail.DETAIL:
            d["id"] = self.id
            d["date"] = self.date
            d["workout"] = self.workout.serialize(detail_level)
        return d
