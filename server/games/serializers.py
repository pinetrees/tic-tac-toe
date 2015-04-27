from rest_framework import pagination
from rest_framework import serializers
from .models import *


class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = ('id', 'game', 'position', 'row', 'col', 'game_index', 'state')



class GameSerializer(serializers.ModelSerializer):
    moves = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ('id', 'player_one', 'player_two', 'current_player', 'game_index', 'state', 'winner', 'is_complete', 'is_private', 'moves')

    
    def get_moves(self, game):
        moves = game.moves.all()
        serializer = MoveSerializer(instance=moves, many=True)
        return serializer.data
