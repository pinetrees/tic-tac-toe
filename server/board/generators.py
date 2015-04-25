from .models import Cell, CellState, Board, BoardTemplate
from board.utility import flatten, inflate, get_sequences

class BoardGenerator:
    sample_sequence = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 1]]
    player_count = 2
    size = 3

    def cells(self):
        for i in range(self.size):
            for j in range(self.size):
                cell, created = Cell.objects.get_or_create(row=i, col=j)


    def board(self, sequence=None):
        if sequence is None:
            sequence = self.sample_sequence
        board = Board.objects.create()
        for game_index, pair in enumerate(sequence):
            cell, created = Cell.objects.get_or_create(row=pair[0], col=pair[1]) 
            CellState.objects.get_or_create(cell=cell, board=board, state=(game_index % 2 + 1), game_index=game_index)

    def boards(self, count=5):
        sequences = get_sequences()
        for i in range(count):
            inflated_sequence = inflate(sequences[i])
            self.board(inflated_sequence)


    def purge(self):
        Cell.objects.all().delete()
        Board.objects.all().delete()


BG = BoardGenerator()
B = Board.objects.first()
