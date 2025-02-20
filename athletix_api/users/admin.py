from django.contrib import admin
from users.models import (
    ExerciseStats,
    MeasurementRecord,
    Profile,
    User,
    Measurement,
    Goal,
)

# Register your models here.
admin.site.register(Profile)


@admin.register(Measurement)
class MeasurementAdmin(admin.ModelAdmin):
    list_display = ("label", "profile")


@admin.register(MeasurementRecord)
class MeasurementRecordAdmin(admin.ModelAdmin):
    list_display = ("measurement", "value__value", "value__unit", "date")


@admin.register(ExerciseStats)
class ExerciseStatsAdmin(admin.ModelAdmin):
    list_display = ("profile", "exercise", "estimated_1rm__value", "max_vol__value", "max_weight__value")


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ("text", "finished", "profile")
