from django.db.models import F
from rest_framework import serializers
from users.units import Kilogram, Pound
from workouts.utils import RepMaxCalculator
from workouts.models import (
    Day,
    UnitValue,
    Workout,
    WorkoutExercise,
    Set,
    Template,
    Exercise,
)


class ReadWriteSerializerMethodField(serializers.SerializerMethodField):
    def __init__(self, method_name=None, **kwargs):
        self.method_name = method_name
        kwargs["source"] = "*"
        super(serializers.SerializerMethodField, self).__init__(**kwargs)

    def to_internal_value(self, data):
        return {self.field_name: data}


class UnitValueSerializer(serializers.ModelSerializer):
    value = ReadWriteSerializerMethodField("_get_value")
    unit = ReadWriteSerializerMethodField("_get_unit")

    def _get_value(self, instance: UnitValue):
        if self.context:
            default_unit = self.context.get("default_unit")
            if default_unit == instance.unit:
                return instance.value
            else:
                if default_unit == "kg" and instance.unit == "lb":
                    return Pound(instance.value).to_kilogram()
                elif default_unit == "lb" and instance.unit == "kg":
                    return Kilogram(instance.value).to_pounds()
                else:
                    return instance.value
        else:
            return instance.value

    def _get_unit(self, instance: UnitValue):
        if instance.unit not in ["kg", "lb"]:
            return instance.unit

        if self.context:
            default_unit = self.context.get("default_unit")
            return default_unit
        else:
            return instance.unit

    class Meta:
        model = UnitValue
        fields = ["value", "unit"]


class SetSerializer(serializers.ModelSerializer):
    exercise = serializers.StringRelatedField(read_only=True)
    tags = serializers.SerializerMethodField("_get_tags")
    weight = UnitValueSerializer()

    def __init__(self, instance=None, data=None, **kwargs):
        from rest_framework.fields import empty

        data = data if data else empty
        super().__init__(instance, data, **kwargs)

        self.fields["weight"].context.update(self.context)

    def _get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]

    class Meta:
        model = Set
        fields = "__all__"


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="exercise.name")
    sets = SetSerializer(many=True)
    exercise = serializers.SerializerMethodField("_get_exercise")

    def __init__(self, instance=None, data=..., **kwargs):
        super().__init__(instance, data, **kwargs)
        self.fields["sets"].context.update(self.context)

    def _get_exercise(self, obj):
        return obj.exercise.pk

    class Meta:
        model = WorkoutExercise
        fields = "__all__"


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True)
    prs = serializers.IntegerField(source="prs_achieved", read_only=True)
    is_template = serializers.SerializerMethodField("_get_is_template")
    volume = UnitValueSerializer(read_only=True)

    def __init__(self, instance=None, data=None, **kwargs):
        from rest_framework.fields import empty

        data = data if data else empty
        super().__init__(instance, data, **kwargs)

        self.fields["exercises"].context.update(self.context)
        self.fields["volume"].context.update(self.context)

    def _get_is_template(self, obj):
        return Template.objects.filter(workout=obj).exists()

    def create(self, validated_data):
        exercises_data = validated_data.pop("exercises")
        workout = Workout.objects.create(**validated_data)

        for exercise_data in exercises_data:
            exercise_name = exercise_data["exercise"]["name"]
            exercise_note = exercise_data["note"]
            exercise_reps_or_duration = exercise_data["reps_or_duration"]
            exercise, _ = Exercise.objects.get_or_create(
                name=exercise_name, creator=validated_data.get("profile")
            )
            workout_exercise = WorkoutExercise.objects.create(
                exercise=exercise,
                note=exercise_note,
                reps_or_duration=exercise_reps_or_duration,
            )

            for set_data in exercise_data["sets"]:
                weight = set_data.pop("weight")
                value = UnitValue.objects.create(
                    value=weight.get("value"), unit=weight.get("unit")
                )
                set_ = Set.objects.create(exercise=workout_exercise, **set_data)
                set_.weight = value
                set_.save()
                workout_exercise.sets.add(set_)

            workout_exercise.save()

            workout.exercises.add(workout_exercise)
            workout_exercise.save(
                analyse_sets=True, profile=validated_data.get("profile")
            )

        workout.set_volume()
        workout.calculate_prs_achieved()

        return workout

    def update(self, instance: Workout, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.note = validated_data.get("note", instance.note)
        instance.performed_date = validated_data.get(
            "performed_date", instance.performed_date
        )
        instance.save()

        for exercise_data in validated_data.get("exercises", []):
            exercise_name = exercise_data["exercise"]["name"]
            exercise, _ = Exercise.objects.get_or_create(
                name=exercise_name, creator=validated_data.get("profile")
            )
            workout_exercise, _ = instance.exercises.get_or_create(
                exercise=exercise,
                note=exercise_data["note"],
                reps_or_duration=exercise_data["reps_or_duration"],
            )
            workout_exercise.sets.all().delete()

            for set_data in exercise_data["sets"]:
                weight = set_data.pop("weight")
                value = UnitValue.objects.create(
                    value=weight.get("value"), unit=weight.get("unit")
                )
                set_ = Set.objects.create(exercise=workout_exercise, **set_data)
                set_.weight = value
                set_.save()
                workout_exercise.sets.add(set_)

            workout_exercise.save()

            instance.exercises.add(workout_exercise)
            workout_exercise.save(analyse_sets=True, profile=validated_data.get("profile"))

        instance.set_volume()
        instance.calculate_prs_achieved()

        return instance

    class Meta:
        model = Workout
        fields = [
            "id",
            "name",
            "profile",
            "volume",
            "prs",
            "creation_date",
            "performed_date",
            "note",
            "exercises",
            "is_template",
        ]


class WorkoutListSerializer(WorkoutSerializer):

    def __init__(self, instance=None, data=None, **kwargs):
        super(serializers.ModelSerializer, self).__init__(instance, data, **kwargs)

    class Meta:
        model = Workout
        fields = ["id", "name", "performed_date", "volume", "prs"]


class TemplateSerializer(serializers.ModelSerializer):
    workout = WorkoutSerializer()
    days = serializers.SlugRelatedField(
        many=True, slug_field="name", queryset=Day.objects.all()
    )

    def __init__(self, instance=None, data=None, **kwargs):
        from rest_framework.fields import empty

        data = data if data else empty
        super().__init__(instance, data, **kwargs)

        self.fields["workout"].context.update(self.context)

    def create(self, validated_data):
        # we need to get the raw workout_data from context,
        # cos the TemplateSerializer.workout field is gonna
        # create its own validated_data which won't match
        # the WorkoutSerializer.create().
        validated_data.pop("workout")
        workout_data = self.context.get("workout_data")

        workout_data["profile"] = validated_data.get("profile").pk
        workout_data["performed_date"] = None

        workout_serializer = WorkoutSerializer(data=workout_data)
        if workout_serializer.is_valid():
            workout = workout_serializer.save()
        else:
            print("error in workout serializer")
            raise serializers.ValidationError(workout_serializer.errors)

        print(validated_data)
        days = validated_data.pop("days")
        template = Template.objects.create(**validated_data, workout=workout)
        template.save()
        template.days.set(days)

        return template

    def update(self, instance: Template, validated_data):
        # workout_data = validated_data.pop("workout")

        validated_data.pop("workout")
        workout_data = self.context.get("workout_data")
        workout_data["profile"] = validated_data.get("profile").pk
        workout_data["performed_date"] = None

        workout_serializer = WorkoutSerializer(instance.workout, data=workout_data)
        if workout_serializer.is_valid():
            workout_serializer.save()
        else:
            raise serializers.ValidationError(workout_serializer.errors)

        instance.days.set(validated_data.pop("days"))
        instance.schedule = validated_data.get("schedule", instance.schedule)
        instance.save()

        return instance

    class Meta:
        model = Template
        fields = ["id", "profile", "workout", "schedule", "days"]


class TemplateListSerializer(TemplateSerializer):
    workout = serializers.SerializerMethodField("_get_workout")

    def _get_workout(self, obj):
        return {
            "name": obj.workout.name,
            "prs": obj.workout.prs_achieved,
            "volume": UnitValueSerializer(
                obj.workout.volume, context=self.context
            ).data,
        }

    class Meta:
        model = Template
        fields = ["id", "workout", "schedule", "days"]


class ExerciseSerializer(serializers.ModelSerializer):
    stats = serializers.SerializerMethodField("_get_stats")
    body_part = serializers.CharField()

    def _get_stats(self, obj):
        from users.models import ExerciseStats
        from users.serializers import ExerciseStatsSerializer

        profile = self.context.get("profile", None)

        try:
            stats = ExerciseStats.objects.get(exercise=obj, profile=profile)
            serializer = ExerciseStatsSerializer(stats, context=self.context)
            return serializer.data
        except ExerciseStats.DoesNotExist:
            return None

    # def create(self, validated_data):
    #     print(validated_data)
    #     return Exercise.objects.create(**validated_data, body_part=validated_data.get("body_part"))

    class Meta:
        model = Exercise
        fields = "__all__"


class ExerciseHistoricalDataSerializer(serializers.ModelSerializer):
    records = serializers.SerializerMethodField("_get_records")

    def _get_records(self, obj):
        workouts = (
            Workout.objects.filter(exercises__exercise=obj)
            .exclude(performed_date=None)
            .order_by("performed_date")
        )
        records = []
        for workout in workouts:
            workout_exercise = workout.exercises.get(exercise=obj)
            sets = SetSerializer(workout_exercise.sets.all(), many=True, context=self.context).data
            total_vol = sum(
                [set_["reps"] * set_["weight"]["value"] for set_ in sets]
            )

            # sets = workout_exercise.sets.all().annotate(vol=F("reps") * F("weight__value"))
            # volume_in_sets = sets.values_list("vol", flat=True)

            best_set = sorted(
                sets, key=lambda set_: set_["weight"]["value"], reverse=True
            )[0]

            best_est_1rm = RepMaxCalculator(
                reps=best_set["reps"], weight=best_set["weight"]["value"]
            ).one_rep_max

            records.append(
                {
                    "performed_date": workout.performed_date,
                    "volume": total_vol,
                    "best_est_1rm": best_est_1rm,
                }
            )

        return records

    class Meta:
        model = Exercise
        fields = "__all__"
