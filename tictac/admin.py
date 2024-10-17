from django.contrib import admin
from .models import Room, GameResult

# Register your models here.

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
	list_display = ('name', 'player1', 'player2', 'created_at')
	show_facets = admin.ShowFacets.ALWAYS

@admin.register(GameResult)
class GameResultAdmin(admin.ModelAdmin):
	list_display = ('room', 'state', 'winner', 'is_draw', 'created_at')
	show_facets = admin.ShowFacets.ALWAYS
