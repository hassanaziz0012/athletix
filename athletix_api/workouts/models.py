from typing import Literal
from django.db import models
from django.db.models import Value, F, Count, Case, When, Q, QuerySet
from django.db.models.functions import Coalesce
from django.utils import timezone
from ordered_model.models import OrderedModel
from users.units import Kilogram, Pound
from workouts.utils import RepMaxCalculator
from enum import Enum
import json


# Create your models here.
class Workout(models.Model):
    profile = models.ForeignKey("users.Profile", on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    note = models.TextField(blank=True)
    exercises = models.ManyToManyField("WorkoutExercise", blank=True)
    volume = models.ForeignKey(
        "UnitValue", on_delete=models.CASCADE, null=True, blank=True
    )
    prs_achieved = models.IntegerField(default=0)

    creation_date = models.DateTimeField(auto_now_add=True)
    performed_date = models.DateTimeField(default=timezone.now, null=True)

    def calculate_prs_achieved(self):
        prs = 0
        for exercise in self.exercises.all():
            ex_prs = sum(
                list(
                    exercise.sets.annotate(tags_n=Count("tags"))
                    .exclude(tags_n=0)
                    .values_list("tags_n", flat=True)
                )
            )
            prs += ex_prs
        self.prs_achieved = prs
        self.save(update_fields=["prs_achieved"])

    def set_volume(self):
        volume_in_sets = Set.annotate_volume(
            Set.annotate_weight(
                Set.objects.filter(exercise__in=self.exercises.all()),
                default_weight_unit=self.profile.default_unit,
            )
        ).values_list("volume", flat=True)
        total_vol = sum(volume_in_sets)
        value = UnitValue.objects.create(value=total_vol, unit="kg")
        self.volume = value
        self.save(update_fields=["volume"])

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.volume is None:
            self.set_volume()

    def delete(self, using=..., keep_parents=...):
        for exercise in self.exercises.all():
            exercise.sets.all().delete()
            exercise.delete()

        return super().delete()

    class Meta:
        ordering = ["-performed_date"]

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"<Workout: {self.name}>"


class Template(models.Model):
    profile = models.ForeignKey("users.Profile", on_delete=models.CASCADE)
    workout = models.ForeignKey("Workout", on_delete=models.CASCADE)

    REPETITION_SCHEDULES = [
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("biweekly", "biweekly"),
    ]
    schedule = models.CharField(max_length=50, choices=REPETITION_SCHEDULES, blank=True)

    days = models.ManyToManyField("Day", blank=True)

    def __str__(self):
        return self.workout.name

    def __repr__(self):
        return f"<Template: {self.workout.name}>"


class Day(models.Model):
    DAYS = [
        ("monday", "Monday"),
        ("tuesday", "Tuesday"),
        ("wednesday", "Wednesday"),
        ("thursday", "Thursday"),
        ("friday", "Friday"),
        ("saturday", "Saturday"),
        ("sunday", "Sunday"),
    ]
    name = models.CharField(max_length=9, choices=DAYS, blank=True, unique=True)

    def __str__(self):
        return self.name


class Exercise(models.Model):
    name = models.CharField(max_length=150)

    BODY_PARTS = [
        ("core", "Core"),
        ("arms", "Arms"),
        ("back", "Back"),
        ("chest", "Chest"),
        ("legs", "Legs"),
        ("shoulders", "Shoulders"),
        ("other", "Other"),
        ("olympic", "Olympic"),
        ("full_body", "Full body"),
        ("cardio", "Cardio"),
    ]

    body_part = models.CharField(choices=BODY_PARTS, default="other", max_length=50)

    is_custom = models.BooleanField(default=True)
    creator = models.ForeignKey(
        "users.Profile", on_delete=models.CASCADE, blank=True, null=True
    )

    @classmethod
    def create_default_exercises(cls):
        with open("default_exercises.json", "r") as f:
            data = json.load(f)

        for exercise in data:
            cls.objects.get_or_create(**exercise, is_custom=False)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"<Exercise: {self.name}>"


class WorkoutExercise(models.Model):
    exercise = models.ForeignKey(
        "Exercise", on_delete=models.CASCADE, related_name="exercise"
    )
    sets = models.ManyToManyField("Set", blank=True, related_name="sets")
    reps_or_duration = models.CharField(
        max_length=8,
        choices=[("reps", "Reps"), ("duration", "Duration")],
        default="reps",
    )
    note = models.TextField(blank=True)

    def add_set_tags(self):
        
        def tag_best_set():
            """
            Applied to the set with the highest volume

            volume = reps * weight
            """
            tag = SetTag.AllowedTags.BEST_SET.value
            current_set_ids = self.sets.all().values_list("pk", flat=True)

            profile = Workout.objects.get(exercises=self).profile

            exercise_sets = Set.annotate_volume(
                Set.annotate_weight(
                    Set.objects.filter(exercise__exercise=self.exercise),
                    default_weight_unit=profile.default_unit,
                )
            )

            best_current_set = (
                exercise_sets.filter(pk__in=current_set_ids).order_by("-volume").first()
            )

            best_all_time_set = (
                exercise_sets.exclude(pk__in=current_set_ids)
                .filter(volume__lt=best_current_set.volume)
                .order_by("-volume")
                .first()
            )

            if best_current_set and best_all_time_set:
                best_current_set.tags.add(SetTag.objects.get_or_create(name=tag)[0])

        def tag_weight():
            """
            Applied when you lift a heavier weight
            """
            tag = SetTag.AllowedTags.WEIGHT.value

            profile = Workout.objects.get(exercises=self).profile

            exercise_sets = Set.annotate_volume(
                Set.annotate_weight(
                    Set.objects.filter(exercise__exercise=self.exercise),
                    default_weight_unit=profile.default_unit,
                )
            )
            current_sets_ids = self.sets.all().values_list("pk", flat=True)

            # get all-time sets performed for this exercise, excluding sets in current workout
            all_time_sets = exercise_sets.exclude(pk__in=current_sets_ids)

            if all_time_sets.count() == 0:
                # first time performing this exercise, so no previous workouts exist.
                # we will just tag the first set, assuming it has a weight (not bodyweight).
                set_ = self.sets.first()
                if set_ and set_.weight.value > 0:
                    set_.tags.add(SetTag.objects.get_or_create(name=tag)[0])
                    set_.save()

            else:
                max_weight_lifted = (
                    all_time_sets.order_by("-parsed_weight").first().parsed_weight
                )

                current_set = (
                    exercise_sets.filter(
                        pk__in=current_sets_ids, parsed_weight__gt=max_weight_lifted
                    )
                    .order_by("-parsed_weight")
                    .first()
                )

                if current_set:
                    set_ = current_set
                    set_.tags.add(SetTag.objects.get_or_create(name=tag)[0])
                    set_.save()

        def tag_pr():
            """
            Applied when you lift a heavier weight for the same number of reps
            """
            tag = SetTag.AllowedTags.PR.value

            profile = Workout.objects.get(exercises=self).profile

            exercise_sets = Set.annotate_volume(
                Set.annotate_weight(
                    Set.objects.filter(exercise__exercise=self.exercise),
                    default_weight_unit=profile.default_unit,
                )
            )
            current_sets_ids = self.sets.all().values_list("pk", flat=True)
            current_sets = exercise_sets.filter(pk__in=current_sets_ids)

            set_reps = current_sets.values_list("reps", flat=True)
            set_ids = current_sets.values_list("pk", flat=True)
            heaviest_set = current_sets.order_by("-parsed_weight").first()

            heaviest_all_time_set = (
                exercise_sets.filter(
                    reps__in=set_reps,
                    parsed_weight__lt=heaviest_set.parsed_weight,
                )
                .exclude(pk__in=set_ids)
                .order_by("-parsed_weight")
                .first()
            )

            if heaviest_all_time_set:
                heaviest_set.tags.add(SetTag.objects.get_or_create(name=tag)[0])
                heaviest_set.save()

        tag_best_set()
        tag_weight()
        tag_pr()

    def set_user_stats(self, profile):
        from users.models import ExerciseStats

        all_sets_stats = (
            Set.objects.filter(exercise__exercise=self.exercise)
            .annotate(
                vol=Coalesce(
                    F("reps") * F("weight__value"), 0, output_field=models.FloatField()
                ),
            )
            .values("weight__value", "reps", "vol")
        )
        max_vol = max([x["vol"] for x in all_sets_stats])
        max_weight = max(all_sets_stats, key=lambda x: x["weight__value"])[
            "weight__value"
        ]
        best_set: Set = all_sets_stats.order_by("-vol").first()

        rm_calc = RepMaxCalculator(best_set["reps"], best_set["weight__value"])
        estimated_1rm = rm_calc.one_rep_max

        exercise_stats, created = ExerciseStats.objects.get_or_create(
            profile=profile, exercise=self.exercise
        )

        if exercise_stats.max_vol:
            exercise_stats.max_vol.value = max_vol
            exercise_stats.max_vol.save()
        else:
            exercise_stats.max_vol = UnitValue.objects.create(
                unit=profile.default_unit, value=max_vol
            )
            exercise_stats.max_vol.save()

        if exercise_stats.max_weight:
            exercise_stats.max_weight.value = max_weight
            exercise_stats.max_weight.save()
        else:
            exercise_stats.max_weight = UnitValue.objects.create(
                unit=profile.default_unit, value=max_weight
            )
            exercise_stats.max_weight.save()

        if exercise_stats.estimated_1rm:
            exercise_stats.estimated_1rm.value = estimated_1rm
            exercise_stats.estimated_1rm.save()
        else:
            exercise_stats.estimated_1rm = UnitValue.objects.create(
                unit=profile.default_unit, value=estimated_1rm
            )
            exercise_stats.estimated_1rm.save()

        exercise_stats.save()

    def analyse_sets(self, profile):
        workout = Workout.objects.get(exercises=self)
        is_part_of_template = Template.objects.filter(workout=workout).exists()
        if self.sets.count() > 0 and not is_part_of_template:
            self.set_user_stats(profile)
            self.add_set_tags()

    def save(self, analyse_sets: bool = False, profile=None, *args, **kwargs):
        super().save(*args, **kwargs)

        if analyse_sets == True:
            self.analyse_sets(profile)

    def __str__(self):
        return self.exercise.name

    def __repr__(self):
        return f"<Exercise: {self.exercise.name}>"


class Set(OrderedModel):
    order_with_respect_to = "exercise"

    exercise = models.ForeignKey(
        "WorkoutExercise", on_delete=models.CASCADE, related_name="workout_exercise"
    )
    reps = models.IntegerField()

    weight = models.ForeignKey(
        "UnitValue", on_delete=models.CASCADE, null=True, blank=True
    )
    duration = models.CharField(max_length=50, null=True, blank=True)

    TYPES = [
        ("N", "Normal"),
        ("W", "Warmup"),
        ("C", "Cooldown"),
        ("F", "Failure"),
        ("D", "Dropset"),
    ]
    type = models.CharField(max_length=50, choices=TYPES, default="N")
    tags = models.ManyToManyField("SetTag", blank=True)

    @classmethod
    def annotate_weight(
        cls, queryset: QuerySet, default_weight_unit: Literal["kg"] | Literal["lb"]
    ) -> QuerySet:
        return queryset.annotate(
            parsed_weight=Case(
                When(weight__unit=default_weight_unit, then=F("weight__value")),
                When(weight__unit="lb", then=Pound(F("weight__value")).to_kilogram()),
                When(weight__unit="kg", then=Kilogram(F("weight__value")).to_pounds()),
            )
        )

    @classmethod
    def annotate_volume(cls, queryset: QuerySet) -> QuerySet:
        return queryset.annotate(volume=F("reps") * F("parsed_weight"))

    def __str__(self):
        return f"{self.reps} reps at {self.weight} kg"

    def __repr__(self):
        return f"<Set: {self.reps} reps at {self.weight} kg>"


class SetTag(models.Model):
    name = models.CharField(max_length=50)

    class AllowedTags(Enum):
        PR = "PR"
        BEST_SET = "Best set"
        WEIGHT = "Weight"

        @classmethod
        def validate(cls, value):
            return value in [i.value for i in cls]

    def save(self, *args, **kwargs):
        if self.AllowedTags.validate(value=self.name) == False:
            raise ValueError(
                f"SetTag name must be one of {list(self.AllowedTags)}. Received: {self.name}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"<SetTag: {self.name}>"


class UnitValue(models.Model):
    UNITS = [
        ("kg", "kg"),
        ("lb", "lb"),
        ("kcal", "kcal"),
        ("cm", "cm"),
    ]
    unit = models.CharField(max_length=5, choices=UNITS, blank=True)
    value = models.FloatField()

    def __str__(self):
        return f"{self.value} {self.unit}"

    def __repr__(self):
        return f"<Weight: {self.value} {self.unit}>"
