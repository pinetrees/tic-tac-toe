from django.db import models
from tic_tac_toe import fields, data
from players.models import Player
from board.utility import flatten_pair, flatten

# Create your models here.
class Cell(models.Model):
    row = models.IntegerField(default=0)
    col = models.IntegerField(default=0)

class BoardTemplate(models.Model):
    board_hash = models.CharField(null=True, max_length=18)

    @classmethod
    def compute_hash(self, sequence):
        return reduce(lambda x, y: str(x) + str(y), [coordinate for pair in sequence for coordinate in pair])


class Board(models.Model):
    player_one = models.ForeignKey(Player, null=True, related_name="board_firsts")
    player_two = models.ForeignKey(Player, null=True, related_name="board_seconds")
    current_player = models.ForeignKey(Player, null=True, related_name="board_currents")
    is_complete = models.BooleanField(default=False)
    template = models.ForeignKey(BoardTemplate, null=True)

    def check_board(self):
        states = [
                set(map(lambda x: flatten_pair([x.cell.row, x.cell.col]), self.cells.filter(state=0).all())),
                set(map(lambda x: flatten_pair([x.cell.row, x.cell.col]), self.cells.filter(state=1).all())),
                set(map(lambda x: flatten_pair([x.cell.row, x.cell.col]), self.cells.filter(state=2).all())),
        ]
        winning_sequences = map(lambda x: flatten(x), data.WINNING_SETS)
        for item in winning_sequences:
            for player_index, state in enumerate(states):
                if player_index != 0 and set(item) <= state:
                    return player_index


    def check_move(self, row_index, col_index):
        row_win = ( self.cells.filter(cell__row=row_index, cell__player=self.current_player).count() == 3 )
        col_win = ( self.cells.filter(cell__col=col_index, cell__player=self.current_player).count() == 3 )

        if self.is_cross_section(row_index, col_index):
            pass

    def is_cross_section(self, row_index, col_index):
        return ( row_index + col_index ) % 2 == 0

class CellState(models.Model):
    cell = models.ForeignKey(Cell, null=True)
    board = models.ForeignKey(Board, null=True, related_name="cells")
    state = fields.IntegerRangeField(min_value=0, max_value=2)
    game_index = fields.IntegerRangeField(min_value=0, max_value=8, null=True)
    player = models.ForeignKey(Player, null=True)

