from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework.test import APITestCase
from .models import Game, Move
from .utility import flatten_pair, flatten, inflate_pair, inflate
from players.models import Player
from players.generators import PlayersGenerator
from tic_tac_toe.data import WINNING_SETS

# Create your tests here.
class GameTests(TestCase):
    def setUp(self):
        if Player.objects.count() < 2:
            PlayersGenerator().players()
        Game.objects.start_game()
        self.game = Game.objects.last()


    def test_starting_state(self):
        self.assertEqual(self.game.moves.count(), 0)
        self.assertEqual(self.game.is_complete, False) 
        self.assertEqual(self.game.winner, None) 
        
    def test_first_move(self):
        self.assertEqual(self.game.move(0, 0, 1), True)
        self.assertEqual(self.game.moves.count(), 1)
        self.assertEqual(self.game.state, 2)
        self.assertEqual(self.game.is_complete, False) 
        self.assertEqual(self.game.winner, None) 

    def test_move_on_complete_game(self):
        self.game.is_complete = True
        self.assertEqual(self.game.move(0, 0, 1), False)

    def test_duplicate_player_move(self):
        self.assertEqual(self.game.move(0, 0, 1), True)
        self.assertEqual(self.game.move(0, 0, 1), False)

    def test_move_on_full_board(self):
        for i in range(9):
            pair = inflate_pair(i);
            self.game.moves.add(
                    Move.objects.create(row=pair[0], col=pair[1], position=i, state=self.game.state)
            )
            self.game.change_state();
        self.assertEqual(self.game.moves.count(), 9)
        self.is_complete = False
        self.assertEqual(self.game.move(0, 0, self.game.state), False)

    def test_duplicate_state_move(self):
        self.assertEqual(self.game.move(0, 0, 1), True)
        self.assertEqual(self.game.move(0, 0, 2), False)

    def test_state_change_on_move(self):
        initialState = self.game.state
        self.game.move(0, 0)
        self.assertEqual( ( initialState == self.game.state ), False )

    def test_that_a_move_was_created(self):
        moveCount = self.game.moves.count()
        self.game.move(0, 0)
        self.assertEqual(moveCount + 1, self.game.moves.count()) 

    def test_move_attributes(self):
        self.game.move(0, 0, 1)
        move = self.game.moves.last()
        self.assertEqual(move.row, 0)
        self.assertEqual(move.col, 0)
        self.assertEqual(move.state, 1)

    def test_base_sequence(self):
        sequence = range(9)
        total_moves = self.game.moves.count()
        inflated_sequence = inflate(sequence)
        for coordinate in inflated_sequence:
            if self.game.is_complete is False:
                self.assertEqual(self.game.move(coordinate[0], coordinate[1], self.game.state), True)
                total_moves += 1
            else:
                self.assertEqual(self.game.move(coordinate[0], coordinate[1], self.game.state), False)
            self.assertEqual(total_moves, self.game.moves.count())

    def test_win_states(self):
        for winning_set in WINNING_SETS:
            #Add two moves to pass our count check. We'll do it illegally, but not in a way which interferes with our logic.
            self.game.moves.add(Move.objects.create(row=0, col=0, position=0, state=2))
            self.game.moves.add(Move.objects.create(row=0, col=0, position=0, state=2))
            for pair in winning_set:
                self.game.moves.add(
                    Move.objects.create(row=pair[0], col=pair[1], position=flatten_pair(pair), state=1)
                )

            #We check that each of these moves, if played last, would result in a win
            for pair in winning_set:
                self.assertEqual(self.game.check_move(pair[0], pair[1], state=1), True)

            self.setUp()


class GameAPITests(APITestCase):
    def setUp(self):
        PlayersGenerator().players()

    def test_current(self):
        url = '/api/games/current/'
        response = self.client.get(url, format='json')
        game = response.data
        self.assertEqual(game['game_index'], 0)
        self.assertEqual(game['state'], 1)
        self.assertEqual(game['winner'], None)
        self.assertEqual(game['is_complete'], False)
        self.assertEqual(game['is_private'], False)

    def test_new(self):
        url = '/api/games/new/'
        response = self.client.get(url, format='json')
        game = response.data
        self.assertEqual(game['game_index'], 0)
        self.assertEqual(game['state'], 1)
        self.assertEqual(game['winner'], None)
        self.assertEqual(game['is_complete'], False)
        self.assertEqual(game['is_private'], False)

    def test_delete_all(self):
        for i in range(3):
            Game.objects.create()
        self.assertEqual(Game.objects.count(), 3)
        url = '/api/games/delete_all/'
        response = self.client.get(url, format='json')
        self.assertEqual(Game.objects.count(), 0)

    def test_move(self):
        game = Game.objects.start_game()
        url = '/api/games/' + str(game.id) + '/move/'
        move = {'row': 0, 'col': 0, 'state': 1}
        response = self.client.post(url, move, format='json')
        self.assertEqual(Game.objects.last().moves.count(), 1)

        _move = Game.objects.last().moves.last()
        self.assertEqual(move['row'], _move.row)
        self.assertEqual(move['col'], _move.col)
        self.assertEqual(move['state'], _move.state)

        _game = response.data
        self.assertEqual(_game['id'], game.id)
        self.assertEqual(len(_game['moves']), 1)

        __move = _game['moves'][0]
        self.assertEqual(__move['row'], move['row'])
        self.assertEqual(__move['col'], move['col'])
        self.assertEqual(__move['state'], move['state'])


    def test_reset(self):
        game = Game.objects.start_game()
        game.move(0, 0, 1)
        self.assertEqual(game.moves.count(), 1)
        self.assertEqual(game.game_index, 1)
        self.assertEqual(game.state, 2)

        url = '/api/games/' + str(game.id) + '/reset/'
        response = self.client.get(url, format="json")

        game = Game.objects.get(pk=game.id)
        self.assertEqual(game.moves.count(), 0)
        self.assertEqual(game.game_index, 0)
        self.assertEqual(game.state, 1)

        game = response.data
        self.assertEqual(len(game['moves']), 0)
        self.assertEqual(game['game_index'], 0)
        self.assertEqual(game['state'], 1)
