from django.core.files.base import ContentFile
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from workouts.serializers import UnitValueSerializer
from users.units import Pound
from users.models import (
    ExerciseStats,
    MeasurementRecord,
    User,
    Profile,
    Measurement,
    Goal,
)
import secrets
import base64


class UserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())], required=False
    )

    def extract_username(self, email):
        username = email.split("@")[0]
        for i in range(100):
            if not User.objects.filter(username=username).exists():
                break
            username = username + secrets.token_hex(4)
        return username

    def validate(self, attrs):
        attrs = super().validate(attrs)
        attrs["username"] = self.extract_username(email=attrs.get("email"))
        return attrs

    class Meta:
        model = User
        fields = ["firstName", "lastName", "username", "email", "password"]


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    profile_picture = serializers.CharField(allow_blank=True)

    def update(self, instance, validated_data):
        try:
            user_data = validated_data.pop("user")

            instance.user.first_name = user_data.get(
                "first_name", instance.user.first_name
            )
            instance.user.last_name = user_data.get(
                "last_name", instance.user.last_name
            )
            instance.user.username = user_data.get("username", instance.user.username)
            instance.user.email = user_data.get("email", instance.user.email)
        except KeyError:
            pass

        try:
            # update profile picture
            data_url: str = validated_data.pop("profile_picture")
            # it can also be the imgur url, so we need to check
            if data_url.startswith("data:"):
                header, encoded = data_url.split(",", 1)
                file_ext = header.split(":")[1].split(";")[0].split("/")[1]

                contentfile = ContentFile(
                    base64.b64decode(encoded),
                    name=f"{instance.user.username}.{file_ext}",
                )
                instance.profile_picture = contentfile
        except KeyError:
            pass

        instance.use_kg = validated_data.get("use_kg", instance.use_kg)

        instance.user.save()
        instance.save()

        return instance

    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile_picture",
            "use_kg",
        ]


class MeasurementSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="get_label_display")
    records = serializers.SerializerMethodField("_get_records")

    def _get_records(self, obj):
        return MeasurementRecordSerializer(
            obj.records.all().order_by("-date"), many=True, context=self.context
        ).data

    def create(self, validated_data):
        instance = super().create(validated_data)
        profile = validated_data.get("profile")
        profile.measurements.add(instance)
        return instance

    class Meta:
        model = Measurement
        fields = "__all__"


class MeasurementRecordSerializer(serializers.ModelSerializer):
    value = UnitValueSerializer()

    def __init__(self, instance=None, data=None, **kwargs):
        from rest_framework.fields import empty

        data = data if data else empty
        super().__init__(instance, data, **kwargs)

        self.fields["value"].context.update(self.context)

    def _get_value(self, record):
        if record.measurement.profile.use_kg == True:
            return record.value
        else:
            return Pound(record.value).to_pounds()

    def create(self, validated_data):
        from workouts.models import UnitValue

        value = validated_data.pop("value")
        unit_value = UnitValue.objects.create(
            value=value.get("value"), unit=value.get("unit")
        )
        instance = MeasurementRecord.objects.create(**validated_data, value=unit_value)
        return instance

    def update(self, instance, validated_data):
        value = validated_data.pop("value")
        instance.value.value = value.get("value")
        instance.value.unit = value.get("unit")
        instance.value.save()

        return instance

    class Meta:
        model = MeasurementRecord
        fields = ["id", "value", "date"]


class ExerciseStatsSerializer(serializers.ModelSerializer):
    estimated_1rm = UnitValueSerializer()
    max_vol = UnitValueSerializer()
    max_weight = UnitValueSerializer()

    def __init__(self, instance=None, data=None, **kwargs):
        from rest_framework.fields import empty
        
        data = data if data else empty
        super().__init__(instance, data, **kwargs)

        self.fields["estimated_1rm"].context.update(self.context)
        self.fields["max_vol"].context.update(self.context)
        self.fields["max_weight"].context.update(self.context)

    class Meta:
        model = ExerciseStats
        fields = "__all__"


class GoalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Goal
        fields = "__all__"
