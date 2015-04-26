from django.test import TestCase
from .models import Game, Move
from .utility import inflate
from players.models import Player
from players.generators import PlayersGenerator

# Create your tests here.
class GameTests(TestCase):
    def setUp(self):
        if Player.objects.count() < 2:
            PlayersGenerator().players()
        Game.objects.start_game()

    def test_starting_state(self):
        game = Game.objects.last()
        self.assertEqual(game.moves.count(), 0)
        self.assertEqual(game.is_complete, False) 
        self.assertEqual(game.winner, None) 
        

    def test_first_move(self):
        game = Game.objects.last()
        self.assertEqual(game.move(0, 0, 1), True)
        self.assertEqual(game.moves.count(), 1)
        self.assertEqual(game.state, 2)
        self.assertEqual(game.is_complete, False) 
        self.assertEqual(game.winner, None) 

    def test_base_sequence(self):
        sequence = range(9)
        game = Game.objects.last()
        total_moves = game.moves.count()
        inflated_sequence = inflate(sequence)
        for coordinate in inflated_sequence:
            if game.is_complete is False:
                self.assertEqual(game.move(coordinate[0], coordinate[1], game.state), True)
                total_moves += 1
            else:
                self.assertEqual(game.move(coordinate[0], coordinate[1], game.state), False)
            self.assertEqual(total_moves, game.moves.count())
