from rest_framework import pagination
from rest_framework import serializers
from .models import *


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('id', 'player_one', 'player_two', 'current_player', 'game_index', 'state', 'winner', 'is_complete')


class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = ('id', 'game', 'position', 'row', 'col', 'game_index', 'state')



