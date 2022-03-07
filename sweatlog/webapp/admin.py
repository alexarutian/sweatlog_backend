from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


from .models import (
    User,
    ExerciseType,
    EquipmentType,
    Exercise,
    Block,
    BlockExercise,
    Workout,
    WorkoutBlock,
    Session,
)


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        # *UserAdmin.fieldsets,  # adds OG field
        (
            None,
            {
                "fields": (
                    "username",
                    "password",
                    "email",
                    "token",
                )
            },
        ),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
        (
            "Other",
            {"fields": ("is_normal_member",)},
        ),
    )


admin.site.register(User, CustomUserAdmin)
admin.site.register(ExerciseType)
admin.site.register(EquipmentType)
admin.site.register(Exercise)
admin.site.register(Block)
admin.site.register(BlockExercise)
admin.site.register(Workout)
admin.site.register(WorkoutBlock)
admin.site.register(Session)
