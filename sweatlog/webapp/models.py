from ast import Name
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import formats
from .helper import date_to_json_string

from django.db.models.signals import pre_save, post_save
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
    MID = 4


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
    name = models.CharField(max_length=100)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exercisetypes",
        null=True,
    )

    objects = ExerciseTypeManager()

    class Meta:
        unique_together = ["name", "user"]

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        # print("serializing Exercise Type")
        d = {}
        if detail_level in (Detail.SUMMARY, Detail.SEARCH, Detail.DETAIL, Detail.MID):
            d = self.search_dict
        return d


class EquipmentTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


# e.g. Barbell, Dumbbell, Machine, Other
class EquipmentType(models.Model, NameableMixin):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="equipmenttypes",
        null=True,
    )

    objects = EquipmentTypeManager()

    class Meta:
        unique_together = ["name", "user"]

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        # print("serializing Equipment Type")
        d = {}
        if detail_level in (Detail.SUMMARY, Detail.SEARCH, Detail.DETAIL, Detail.MID):
            d = self.search_dict
        return d


class ExerciseManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class Exercise(models.Model, NameableMixin):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True, null=True)
    exercise_type = models.ForeignKey(
        ExerciseType,
        on_delete=models.SET_NULL,
        related_name="exercises",
        null=True, blank=True
    )
    equipment_type = models.ForeignKey(
        EquipmentType,
        on_delete=models.SET_NULL,
        related_name="exercises",
        null=True, blank=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exercises",
        null=True,
    )

    objects = ExerciseManager()

    class Meta:
        unique_together = ["name", "user"]

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        # print("serializing Exercise Type")
        d = {}
        if detail_level in (Detail.SEARCH, Detail.SUMMARY):
            d = self.search_dict
        d["name"] = self.name
        d["id"] = self.id
        if self.description:
            d["description"] = self.description
        if detail_level == Detail.MID:
            if self.exercise_type:
                d["exercise_type_id"] = self.exercise_type_id
            if self.equipment_type:
                d["equipment_type_id"] = self.equipment_type_id
        elif detail_level == Detail.DETAIL:
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
        # print("serializing stats")
        d = {}
        if detail_level in (Detail.SUMMARY, Detail.SEARCH, Detail.DETAIL, Detail.MID):
            d = self.search_dict
        return d


class Block(models.Model, NameableMixin):
    name = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="blocks",
        null=True,
    )

    # class Meta:
    #     unique_together = ["name", "user"]

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        # print("serializing blocks")
        d = {}
        if detail_level in (Detail.SEARCH, Detail.SUMMARY):
            d = self.search_dict

        elif detail_level in (Detail.DETAIL, Detail.MID):
            d["name"] = self.name
            d["id"] = self.id
            exercises = []
            d["exercises"] = exercises
            for be in self.blockexercises.all():
                bed = {}
                if detail_level == Detail.DETAIL:
                    bed["exercise"] = be.exercise.serialize(detail_level)
                else:
                    bed["exercise_id"] = be.exercise.id
                bed["exercise_order"] = be.exercise_order
                if be.stat:
                    bed["stats"] = be.stat.serialize()
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
        Stat, on_delete=models.CASCADE, related_name="blockexercises", null=True
    )

    # do I need this?
    # class Meta:
    #     unique_together = ["block", "exercise", "exercise_order"]

    def __str__(self):
        return self.block.name + " - " + self.exercise.name


class Workout(models.Model, NameableMixin):
    name = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workouts",
        null=True,
    )
    updated_by = models.ForeignKey(
        "self", null=True, on_delete=models.SET_NULL, related_name="updates"
    )

    # class Meta:
    #     unique_together = ["name", "user"]

    def __str__(self):
        return self.name

    def serialize(self, detail_level=Detail.SUMMARY):
        # print("serializing workouts")
        d = {}
        if detail_level in (Detail.SEARCH, Detail.SUMMARY):
            d = self.search_dict
        elif detail_level in (Detail.DETAIL, Detail.MID):
            d["name"] = self.name
            if self.updated_by:
                d["updated_by_id"] = self.updated_by.id
            d["id"] = self.id
            blocks = []
            d["blocks"] = blocks
            for wb in self.workoutblocks.all():
                bd = {}
                if detail_level == Detail.DETAIL:
                    bd["block"] = wb.block.serialize(detail_level)
                    bd["block"]["block_quantity"] = wb.block_quantity
                else:
                    bd["block_id"] = wb.block.id
                    bd["block_quantity"] = wb.block_quantity
                    bd["block_order"] = wb.block_order
                blocks.append(bd)
        return d


class WorkoutBlock(models.Model):
    workout = models.ForeignKey(
        Workout, on_delete=models.CASCADE, related_name="workoutblocks", null=True
    )
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name="workoutblocks", null=True
    )
    block_quantity = models.IntegerField(default=1, null=True)
    block_order = models.IntegerField()

    # do I need this?
    # class Meta:
    #     unique_together = ["workout", "block", "block_order"]

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
        # print("serializing sessions")
        d = {}
        d["id"] = self.id
        d["date"] = self.date
        d["workout_name"] = self.workout.name
        return d

    def serialize(self, detail_level=Detail.SUMMARY):
        d = {}
        if detail_level in (Detail.SEARCH, Detail.SUMMARY):
            d = self.search_dict
        elif detail_level in (Detail.DETAIL, Detail.MID):
            d["id"] = self.id
            d["date"] = self.date
            d["workout"] = self.workout.serialize(detail_level)
        return d


# every time a new user is created, create a set of fixtures unique to them!
@receiver(post_save, sender=User)
# can't do arguments out of order (order matters)
def user_created_fixtures(sender, instance, created, **kwargs):
    if created == True:
        user = instance
        cardio = ExerciseType.objects.create(name="cardio", user=user)
        strength = ExerciseType.objects.create(name="strength", user=user)
        stretching = ExerciseType.objects.create(name="stretching/mobility", user=user)
        other_et = ExerciseType.objects.create(name="other", user=user)
        dumbbell = EquipmentType.objects.create(name="dumbbell", user=user)
        barbell = EquipmentType.objects.create(name="barbell", user=user)
        machine = EquipmentType.objects.create(name="machine", user=user)
        other_eq = EquipmentType.objects.create(name="other", user=user)
        no_eq = EquipmentType.objects.create(name="none", user=user)
        barbell_curl = Exercise.objects.create(
            name="barbell curl",
            exercise_type=strength,
            equipment_type=barbell,
            user=user,
        )
        dumbbell_curl = Exercise.objects.create(
            name="dumbbell curl",
            exercise_type=strength,
            equipment_type=dumbbell,
            user=user,
        )
        jogging = Exercise.objects.create(
            name="jogging", exercise_type=cardio, equipment_type=no_eq, user=user
        )
        rest = Exercise.objects.create(
            name="rest", exercise_type=other_et, equipment_type=no_eq, user=user
        )
        stat1 = Stat.objects.create(sets=3, reps=12, weight_lb=45)
        stat2 = Stat.objects.create(sets=3, reps=10, weight_lb=15)
        stat3 = Stat.objects.create(time_in_seconds=60)
        stat4 = Stat.objects.create(time_in_seconds=30)
        curls_block = Block.objects.create(name="curls", user=user)
        jogging_intervals_block = Block.objects.create(
            name="jogging intervals", user=user
        )
        jogging_be_1 = BlockExercise.objects.create(
            exercise=jogging,
            exercise_order=1,
            block=jogging_intervals_block,
            stat=stat3,
        )
        jogging_be_2 = BlockExercise.objects.create(
            exercise=rest, exercise_order=2, block=jogging_intervals_block, stat=stat4
        )
        curl_be_1 = BlockExercise.objects.create(
            exercise=barbell_curl, exercise_order=1, block=curls_block, stat=stat1
        )
        curl_be_2 = BlockExercise.objects.create(
            exercise=dumbbell_curl, exercise_order=2, block=curls_block, stat=stat2
        )
        curls_workout = Workout.objects.create(name="my curls workout", user=user)
        tuesdays_workout = Workout.objects.create(name="tuesday workout", user=user)
        tw_wb_curls = WorkoutBlock.objects.create(
            workout=tuesdays_workout, block=curls_block, block_quantity=1, block_order=1
        )
        tw_wb_jogging = WorkoutBlock.objects.create(
            workout=tuesdays_workout,
            block=jogging_intervals_block,
            block_quantity=10,
            block_order=2,
        )
