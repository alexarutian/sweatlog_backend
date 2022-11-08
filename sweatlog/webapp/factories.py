from black import nullcontext
import factory
import random
import datetime
from factory.django import DjangoModelFactory
from factory.django import DjangoOptions
from django.db.models import Q
from faker import Faker

from .models import (
    User,
    Exercise,
    ExerciseType,
    EquipmentType,
    Stat,
    Block,
    BlockExercise,
    Workout,
    WorkoutBlock,
    Session,
)


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker("email")
    username = factory.Faker("email")
    password = "test"


class ExerciseFactory(DjangoModelFactory):
    class Meta:
        model = Exercise

    name = factory.Faker("word")
    description = factory.Faker("text")
    exercise_type = factory.Iterator(ExerciseType.objects.all())
    equipment_type = factory.Iterator(EquipmentType.objects.all())
    user = factory.Iterator(User.objects.all())


class StatFactory(DjangoModelFactory):
    class Meta:
        model = Stat

    sets = random.randint(1, 7)
    reps = random.randint(1, 20)
    weight_lb = random.randint(0, 135)
    time_in_seconds = 0


class StatFactory2(DjangoModelFactory):
    class Meta:
        model = Stat

    sets = 0
    reps = 0
    weight_lb = 0
    time_in_seconds = random.randint(0, 180)


class BlockFactory(DjangoModelFactory):
    class Meta:
        model = Block

    name = factory.Faker("sentence", nb_words=random.randint(1, 5))
    user = factory.Iterator(User.objects.all())


class BlockExerciseFactory(DjangoModelFactory):
    class Meta:
        model = BlockExercise

    # use only non-template blocks
    block = factory.SubFactory(BlockFactory)  # addressses foreign keys!

    exercise = factory.SubFactory(ExerciseFactory)  # addresses foreign keys!
    # exercise = factory.Iterator(
    #     Exercise.objects.get(user=factory.SelfAttribute("block.user"))
    # )
    exercise_order = random.randint(1, 5)
    stat = factory.Iterator(Stat.objects.all())


class WorkoutFactory(DjangoModelFactory):
    class Meta:
        model = Workout

    name = factory.Faker("sentence", nb_words=random.randint(1, 5))
    user = factory.Iterator(User.objects.all())


class WorkoutBlockFactory(DjangoModelFactory):
    class Meta:
        model = WorkoutBlock

    workout = factory.SubFactory(WorkoutFactory)
    block = factory.SubFactory(BlockFactory)
    block_quantity = random.randint(1, 10)
    block_order = random.randint(1, 5)


class SessionFactory(DjangoModelFactory):
    class Meta:
        model = Session

    date = factory.Faker(
        "date_between_dates",
        date_start=datetime.date(2022, 3, 9),
        date_end=datetime.date(2022, 10, 25),
    )
    workout = factory.SubFactory(WorkoutFactory)


##### SINGLE USER FACTORIES ######


class SingleUserExerciseFactory(DjangoModelFactory):
    class Meta:
        model = Exercise

    name = factory.Faker("word")
    description = factory.Faker("text")
    exercise_type = factory.Iterator(ExerciseType.objects.filter(user__id=2))
    equipment_type = factory.Iterator(EquipmentType.objects.filter(user__id=2))
    user = User.objects.get(id=2)


class SingleUserStatFactory(DjangoModelFactory):
    class Meta:
        model = Stat

    sets = random.randint(1, 7)
    reps = random.randint(1, 20)
    weight_lb = random.randint(0, 135)
    time_in_seconds = 0


class SingleUserStatFactory2(DjangoModelFactory):
    class Meta:
        model = Stat

    sets = 0
    reps = 0
    weight_lb = 0
    time_in_seconds = random.randint(0, 180)


class SingleUserBlockFactory(DjangoModelFactory):
    class Meta:
        model = Block

    name = factory.Faker("sentence", nb_words=random.randint(1, 5))
    user = User.objects.get(id=2)


class SingleUserBlockExerciseFactory(DjangoModelFactory):
    class Meta:
        model = BlockExercise

    # use only non-template blocks
    block = factory.Iterator(Block.objects.filter(user=User.objects.get(id=2)))

    exercise = factory.Iterator(Exercise.objects.filter(user=User.objects.get(id=2)))
    exercise_order = random.randint(1, 5)
    stat = factory.Iterator(Stat.objects.all())


class SingleUserWorkoutFactory(DjangoModelFactory):
    class Meta:
        model = Workout

    name = factory.Faker("sentence", nb_words=random.randint(1, 5))
    user = User.objects.get(id=2)


class SingleUserWorkoutBlockFactory(DjangoModelFactory):
    class Meta:
        model = WorkoutBlock

    workout = factory.Iterator(Workout.objects.filter(user=User.objects.get(id=2)))
    block = factory.Iterator(Block.objects.filter(user=User.objects.get(id=2)))
    block_quantity = random.randint(1, 10)
    block_order = random.randint(1, 5)


class SingleUserSessionFactory(DjangoModelFactory):
    class Meta:
        model = Session

    date = factory.Faker(
        "date_between_dates",
        date_start=datetime.date(2022, 3, 17),
        date_end=datetime.date(2022, 4, 10),
    )
    workout = factory.SubFactory(SingleUserWorkoutFactory)


# UNCOMMENT AND EXECUTE IN ORDER!!
# from webapp import factories
# from webapp.models import *
# for x in range(1000):
#    factories.UserFactory()
#    factories.ExerciseFactory()

# make random things for each user
# loop through users

fake = Faker()


def create_users(no_of_users):
    for x in range(no_of_users):
        email = fake.email()
        User.objects.create(email=email, username=email)
        print(email)
