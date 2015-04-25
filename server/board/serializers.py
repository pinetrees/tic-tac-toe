from rest_framework import pagination
from rest_framework import serializers
from .models import *


class CellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cell
        fields = ('id', 'row', 'col')


class CellStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CellState
        fields = ('id', 'cell', 'state', 'game_index', 'player')


class BoardSerializer(serializers.ModelSerializer):
    cells = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ('id', 'cells', 'player_one', 'player_two', 'current_player', 'is_complete')

    def get_cells(self, board):
        cells = board.cells.all()
        serializer = CellStateSerializer(instance=cells, many=True)
        return serializer.data


class BoardTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardTemplate
        fields = ('id', 'cells')


