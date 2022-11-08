import random
import datetime
from factory.django import DjangoModelFactory
from django.db.models import Q
from faker import Faker
from django.db import IntegrityError, transaction


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


# UNCOMMENT AND EXECUTE IN ORDER!!
# from webapp import factories
# from webapp.models import *
# for x in range(1000):
#    factories.UserFactory()
#    factories.ExerciseFactory()

# make random things for each user
# loop through users

fake = Faker()


@transaction.atomic
def create_users(no_of_users):
    print("creating users...")

    used_emails = set()

    for x in range(no_of_users):
        email = get_unique(used_emails, fake.email)

        User.objects.create(email=email, username=email)
        # print(email)


def get_unique(used_values, value_generator):
    temp = value_generator()
    while temp in used_values:
        temp = value_generator()
    used_values.add(temp)
    return temp


@transaction.atomic
def generate_fake_data_for_user(user):
    # print("generating data for", user.email)

    # set up counts to loop through
    no_of_exercises = random.randint(5, 100)
    no_of_blocks = random.randint(10, 50)
    no_of_workouts = random.randint(5, 200)
    no_of_sessions = random.randint(20, 200)

    # get user's exercise types and equipment types
    exercise_types = ExerciseType.objects.filter(user=user)
    equipment_types = EquipmentType.objects.filter(user=user)

    # create a bunch of exercises
    used_exercise_names = set(["jogging", "rest"])

    for x in range(no_of_exercises):

        Exercise.objects.create(
            name=get_unique(used_exercise_names, fake.word),
            description=fake.sentence(),
            exercise_type=random.choice(exercise_types),
            equipment_type=random.choice(equipment_types),
            user=user,
        )

    exercises = Exercise.objects.filter(user=user)

    # create a bunch of stat objects
    for x in range(no_of_exercises):
        Stat.objects.create(
            sets=random.randint(1, 7),
            reps=random.randint(1, 20),
            weight_lb=random.randint(0, 135),
            time_in_seconds=0,
        )
    stats = Stat.objects.all()

    for x in range(no_of_exercises):
        Stat.objects.create(
            sets=0, reps=0, weight_lb=0, time_in_seconds=random.randint(0, 360)
        )

    used_block_names = set()
    for x in range(no_of_blocks):
        Block.objects.create(user=user, name=get_unique(used_block_names, fake.word))

    blocks = Block.objects.filter(user=user)

    for x in range(no_of_blocks * no_of_exercises * 2):
        BlockExercise.objects.create(
            block=random.choice(blocks),
            exercise=random.choice(exercises),
            exercise_order=random.randint(1, 5),
            stat=random.choice(stats),
        )

    used_workout_names = set()
    for x in range(no_of_workouts):
        Workout.objects.create(
            name=get_unique(used_workout_names, fake.word), user=user
        )
    workouts = Workout.objects.filter(user=user)

    for x in range(no_of_workouts * no_of_blocks * 2):
        WorkoutBlock.objects.create(
            workout=random.choice(workouts),
            block=random.choice(blocks),
            block_quantity=random.randint(1, 10),
            block_order=random.randint(1, 5),
        )

    for x in range(no_of_sessions):
        Session.objects.create(
            date=datetime.datetime.strptime(fake.date(), "%Y-%m-%d").date(),
            workout=random.choice(workouts),
        )


def generate_all_user_data():
    for user in User.objects.all():
        try:
            generate_fake_data_for_user(user)
        except IntegrityError as e:
            print(e)
            breakpoint()


# INSTRUCTIONS TO GENERATE A TON OF STUFF
# rm db.sqlite3; python manage.py migrate; python manage.py createsuperuser --noinput; python manage.py shell
# from webapp import faker
# faker.create_users(1000)
# faker.generate_all_user_data
