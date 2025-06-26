from django.contrib import admin
from .models import SetTag, UnitValue, Workout, WorkoutExercise, Set, Template, Exercise


# Register your models here.
@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ("name", "profile", "volume", "performed_date", "note")


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ("workout", "schedule", "days")

    def days(self, template):
        return ", ".join(list(template.days.all().values_list("name", flat=True)))


@admin.register(Set)
class SetAdmin(admin.ModelAdmin):
    list_display = ("weight", "reps", "type", "_tags")

    def _tags(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])


@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ("exercise", "note", "_sets")
    actions = ["update_exercise_stats"]

    def _sets(self, exercise):
        return ", ".join([str(set_) for set_ in exercise.sets.all()])

    def update_exercise_stats(self, request, queryset):
        for exercise in queryset:
            exercise.set_user_stats()

        self.message_user(request, f"Updated {queryset.count()} exercises")


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("name", "body_part", "is_custom")
    list_filter = ("is_custom", "body_part")


admin.site.register(SetTag)


@admin.register(UnitValue)
class UnitValueAdmin(admin.ModelAdmin):
    list_display = ("value", "unit")
