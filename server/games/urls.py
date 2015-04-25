from .viewsets import *


def register_board_urls(router):
    router.register(r'games', GameViewSet)
    router.register(r'moves', MoveViewSet)
