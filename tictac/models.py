from django.db import models

# Create your models here.

class Room(models.Model):
    name = models.CharField(max_length=50, unique=True)
    player1 = models.CharField(max_length=50, blank=True, null=True)
    player2 = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GameResult(models.Model):
    class State(models.TextChoices):
        FINISHED = 'FN',
        UNFINISHED = 'UFN'

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="game_results")
    state = models.CharField(max_length=3, choices=State.choices, default=State.UNFINISHED)
    winner = models.CharField(max_length=50, blank=True, null=True)
    is_draw = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game in {self.room.name} - Winner: {self.winner or 'Draw'}"
