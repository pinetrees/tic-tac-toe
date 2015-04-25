from .models import Player

class PlayerGenerator:
    player_count = 2
    colors = ['red', 'blue']

    def players(self):
        for i in range(self.player_count):
            player, created = Player.objects.get_or_create(name="Player " + str(i+1), color=self.colors[i])

PG = PlayerGenerator()
player_one = Player.objects.first()
player_two = Player.objects.all()[1:2]
