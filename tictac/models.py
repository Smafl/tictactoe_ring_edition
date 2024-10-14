from django.db import models

# Create your models here.

class Room(models.Model):
    name = models.CharField(max_length=50, unique=True)
    player1 = models.CharField(max_length=50, blank=True, null=True)
    player2 = models.CharField(max_length=50, blank=True, null=True)
    # game_state = models.JSONField(default=list)  # Store game state (board, moves, etc.)
    # current_turn = models.CharField(max_length=50, default="player1")
    # winner = models.CharField(max_length=50, blank=True, null=True)
    # is_draw = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
