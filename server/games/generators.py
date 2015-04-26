from .models import Game, Move
from .utility import flatten_pair, flatten, inflate, get_sequences

class GameGenerator:
    sample_sequence = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 1]]
    player_count = 2
    size = 3


    def game(self, sequence=None):
        if sequence is None:
            sequence = self.sample_sequence
        game = Game.objects.create()
        for game_index, pair in enumerate(sequence):
            Move.objects.get_or_create(row=pair[0], col=pair[1], position=flatten_pair(pair), game=game, state=(game_index % 2 + 1), game_index=game_index)

    def games(self, count=5):
        sequences = get_sequences()
        for i in range(count):
            inflated_sequence = inflate(sequences[i])
            self.game(inflated_sequence)


    def purge(self):
        Game.objects.all().delete()


GG = GameGenerator()
G = Game.objects.last()
