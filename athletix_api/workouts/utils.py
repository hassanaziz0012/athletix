from datetime import datetime, timedelta
from typing import Dict, List


class RepMaxCalculator:
    def __init__(self, reps: int, weight: float):
        self.reps = reps
        self.weight = weight
        self.one_rep_max = self.calculate_one_rep_max()

    def calculate_one_rep_max(self):
        return self.weight / (1.0278 - (0.0278 * self.reps))
    
    def rep_max_at(self, reps: int):
        return self.one_rep_max * (1.0278 - (0.0278 * reps))


def get_repeating_dates(repeat: str, days: List[str]) -> List[datetime.date]:
    today = datetime.today()
    next_7_days = [today + timedelta(days=i) for i in range(7)]
    
    # Convert days and repeat to lowercase for consistency
    days = [day.lower() for day in days]
    repeat = repeat.lower()
    
    # Filter dates based on the repeat pattern
    repeating_dates = []
    for date in next_7_days:
        weekday_name = date.strftime('%A').lower()
        if repeat == 'daily' or weekday_name in days:
            if repeat == 'weekly' and date.weekday() == today.weekday():
                repeating_dates.append(date.date())
            elif repeat == 'biweekly' and (date - today).days % 14 == 0:
                repeating_dates.append(date.date())
            elif repeat == 'daily' or repeat == 'weekly':
                repeating_dates.append(date.date())
                
    return repeating_dates
