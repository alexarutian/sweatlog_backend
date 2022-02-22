from django.contrib import admin

from .models import (
    ExerciseType,
    EquipmentType,
    Exercise,
    Block,
    BlockExercise,
    Workout,
    WorkoutBlock,
    WorkoutLog,
)

admin.site.register(ExerciseType)
admin.site.register(EquipmentType)
admin.site.register(Exercise)
admin.site.register(Block)
admin.site.register(BlockExercise)
admin.site.register(Workout)
admin.site.register(WorkoutBlock)
admin.site.register(WorkoutLog)
