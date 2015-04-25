from .viewsets import *


def register_players_urls(router):
    router.register(r'players', PlayerViewSet)
