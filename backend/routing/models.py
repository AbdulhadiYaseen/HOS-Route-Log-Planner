from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    cycle_hours = models.FloatField()
    start_time = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    response_json = models.TextField() # Holds the full pre-calculated timeline, logs, and routes

    def __str__(self):
        return f"Trip {self.id} for {self.user.username}: {self.current_location} -> {self.dropoff_location}"
