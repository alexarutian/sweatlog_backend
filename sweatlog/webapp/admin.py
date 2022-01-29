from django.contrib import admin

from .models import (
    ExerciseType,
    EquipmentType,
    Exercise,
    Block,
    BlockContent,
    Workout,
    WorkoutContent,
    WorkoutLog,
)

admin.site.register(ExerciseType)
admin.site.register(EquipmentType)
admin.site.register(Exercise)
admin.site.register(Block)
admin.site.register(BlockContent)
admin.site.register(Workout)
admin.site.register(WorkoutContent)
admin.site.register(WorkoutLog)
