from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )
    measurements = models.ManyToManyField(
        "Measurement", blank=True, related_name="profile_measurements"
    )
    use_kg = models.BooleanField(default=True)

    @property
    def default_unit(self):
        return "kg" if self.use_kg else "lb"

    def __str__(self):
        return f"{self.user.username} Profile"

    def __repr__(self):
        return f"<Profile: {self.user.username} Profile>"


class Measurement(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

    LABELS = [
        # core
        ("weight", "Weight"),
        ("calories", "Calories"),
        ("body_fat", "Body Fat"),
        # body part
        ("neck", "Neck"),
        ("shoulders", "Shoulders"),
        ("chest", "Chest"),
        ("waist", "Waist"),
        ("hips", "Hips"),
        ("left_bicep", "Left Bicep"),
        ("right_bicep", "Right Bicep"),
        ("left_forearm", "Left Forearm"),
        ("right_forearm", "Right Forearm"),
        ("upper_abs", "Upper Abs"),
        ("lower_abs", "Lower Abs"),
        ("left_thigh", "Left Thigh"),
        ("right_thigh", "Right Thigh"),
        ("left_calf", "Left Calf"),
        ("right_calf", "Right Calf"),
    ]

    label = models.CharField(max_length=50, choices=LABELS)
    records = models.ManyToManyField(
        "MeasurementRecord", blank=True, related_name="measurement_records"
    )
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.label}"

    def __repr__(self):
        return f"<Measurement: {self.label}>"


class MeasurementRecord(models.Model):
    measurement = models.ForeignKey(
        Measurement, on_delete=models.CASCADE, related_name="measurement_record"
    )
    value = models.ForeignKey(
        "workouts.UnitValue",
        on_delete=models.CASCADE,
        related_name="measurement_record_value",
    )
    date = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if self.measurement.label == "weight":
            self.unit = "kg"
        elif self.measurement.label == "calories":
            self.unit = "kcal"
        elif self.measurement.label == "body_fat":
            self.unit = "%"
        elif self.measurement.label in ["neck", "shoulders", "chest", "waist", "hips"]:
            self.unit = "cm"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.measurement.label}: {self.value}"

    def __repr__(self):
        return f"<MeasurementRecord: {self.measurement.label}: {self.value}>"


class ExerciseStats(models.Model):
    profile = models.ForeignKey(
        "users.Profile", on_delete=models.CASCADE, related_name="exercise_stats_profile"
    )
    exercise = models.ForeignKey(
        "workouts.Exercise",
        on_delete=models.CASCADE,
        related_name="exercise_stats_exercise",
    )
    estimated_1rm = models.ForeignKey(
        "workouts.UnitValue",
        on_delete=models.CASCADE,
        related_name="exercise_stats_estimated_1rm",
        null=True,
        blank=True,
    )
    max_vol = models.ForeignKey(
        "workouts.UnitValue",
        on_delete=models.CASCADE,
        related_name="exercise_stats_max_vol",
        null=True,
        blank=True,
    )
    max_weight = models.ForeignKey(
        "workouts.UnitValue",
        on_delete=models.CASCADE,
        related_name="exercise_stats_max_weight",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.exercise.name} Stats"

    def __repr__(self):
        return f"<ExerciseStats: {self.exercise.name} Stats>"


class Goal(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    text = models.TextField()
    description = models.TextField(null=True, blank=True)
    finished = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text}"

    def __repr__(self):
        return f"<Goal: {self.text}>"
