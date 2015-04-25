from django.db import models
from tic_tac_toe import fields, data
from players.models import Player
from board.utility import flatten_pair, flatten

# Create your models here.
class GameManager(models.Manager):
    def start_game(self, *args, **kwargs):
        assert Player.objects.count() >= 2
        game = Game.objects.create(player_one=Player.objects.all()[0:1][0], player_two=Player.objects.all()[1:2][0])
        return game

class Game(models.Model):
    player_one = models.ForeignKey(Player, null=True, related_name="one_games")
    player_two = models.ForeignKey(Player, null=True, related_name="two_games")
    current_player = models.ForeignKey(Player, null=True, related_name="waiting_games")
    game_index = fields.IntegerRangeField(min_value=0, max_value=8, default=0)
    state = fields.IntegerRangeField(min_value=0, max_value=2, default=0)
    winner = models.ForeignKey(Player, null=True, related_name="games_won")
    is_complete = models.BooleanField(default=False)

    objects = GameManager()

    def check_game(self):
        states = [
                set(map(lambda x: flatten_pair([x.row, x.col]), self.moves.filter(state=0).all())),
                set(map(lambda x: flatten_pair([x.row, x.col]), self.moves.filter(state=1).all())),
                set(map(lambda x: flatten_pair([x.row, x.col]), self.moves.filter(state=2).all())),
        ]
        winning_sequences = map(lambda x: flatten(x), data.WINNING_SETS)
        for item in winning_sequences:
            for player_index, state in enumerate(states):
                if player_index != 0 and set(item) <= state:
                    return player_index


    def check_move(self, row_index, col_index, state):
        print "Checking if player " + str(state) + " won on row " + str(row_index) + " and column " + str(col_index)
        row_win = ( self.moves.filter(row=row_index, state=state).count() == 3 )
        if row_win:
            return self.declare_winner(state)

        col_win = ( self.moves.filter(col=col_index, state=state).count() == 3 )
        if col_win:
            return self.declare_winner(state)

        #Clean this up, damn it!
        if self.is_cross_section(row_index, col_index):
            first_cross_section_win = ( self.moves.filter(position__in=flatten(data.FIRST_CROSS_SECTION), state=state).count() == 3 )
            if first_cross_section_win:
                return self.declare_winner(state)
            second_cross_section_win = ( self.moves.filter(position__in=flatten(data.SECOND_CROSS_SECTION), state=state).count() == 3 )
            if second_cross_section_win:
                return self.declare_winner(state)
         
        return False

    def move(self, row_index, col_index, state):
        if self.is_complete:
            print "The game is complete"
            return False
        elif self.state == state:
            #The player was the last to move
            print "It is not this player's turn"
            return False
        elif self.moves.count() >= 9:
            print "All cells are filled"
            return False
        elif self.moves.filter(row=row_index, col=col_index).count() > 0:
            print "This space is taken"
            return False
        else:
            self.game_index += 1
            move = Move.objects.create(
                    game=self, 
                    position=flatten_pair([row_index, col_index]), 
                    row=row_index, 
                    col=col_index, 
                    game_index=self.game_index,
                    state=state,
            )
            self.state = state
            self.save()
            return self.check_move(row_index, col_index, state)

    def is_cross_section(self, row_index, col_index):
        return ( row_index + col_index ) % 2 == 0

    def declare_winner(self, state):
        assert state in [1, 2]
        self.is_complete = True
        if state == 1:
            self.winner = self.player_one
        else:
            self.winner = self.player_two
        self.save()
        print "Player " + str(state) + " won"
        return True


class Move(models.Model):
    game = models.ForeignKey(Game, null=True, related_name="moves")
    position = fields.IntegerRangeField(min_value=0, max_value=8)
    row = fields.IntegerRangeField(min_value=0, max_value=8)
    col = fields.IntegerRangeField(min_value=0, max_value=8)
    game_index = fields.IntegerRangeField(min_value=0, max_value=8, null=True)
    state = fields.IntegerRangeField(min_value=0, max_value=2)

    def __str__(self):
        return "Player " + str(self.state) + " moves to position " + str(self.position) + " on move " + str(self.game_index)

