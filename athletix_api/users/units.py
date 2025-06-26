class Unit:
    unit = None
    unit_plural = None

    def __init__(self, value):
        self.value = value

    def to_pounds(self):
        return self.value

    def to_kilogram(self):
        return self.value


class Kilogram(Unit):
    unit = "kg"
    unit_plural = "kg"

    def to_pounds(self):
        return self.value * 2.20462


class Pound(Unit):
    unit = "lb"
    unit_plural = "lbs"

    def to_kilogram(self):
        return self.value / 2.20462
