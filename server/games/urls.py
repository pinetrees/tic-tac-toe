from .viewsets import *


def register_games_urls(router):
    router.register(r'games', GameViewSet)
    router.register(r'moves', MoveViewSet)
