from .viewsets import *


def register_board_urls(router):
    router.register(r'cells', CellViewSet)
    router.register(r'cell_states', CellStateViewSet)
    router.register(r'boards', BoardViewSet)
    router.register(r'board_templates', BoardTemplateViewSet)
