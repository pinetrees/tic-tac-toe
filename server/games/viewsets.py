from rest_framework import viewsets, permissions, generics, views
from rest_framework.parsers import FileUploadParser
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from .serializers import *


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    @list_route(methods=['GET'])
    def current(self, request):
        game = Game.objects.filter(is_complete=False).last()
        if game is None:
            game = Game.objects.start_game()
        serializer = GameSerializer(instance=game)
        return Response(serializer.data)

    @list_route(methods=['GET'])
    def new(self, request):
        game = Game.objects.start_game()
        serializer = GameSerializer(instance=game)
        return Response(serializer.data)

    @list_route(methods=['GET'])
    def delete_all(self, request, pk=None):
        Game.objects.all().delete()
        Player.objects.update(score=0)
        return Response({})


    @detail_route(methods=['POST'])
    def move(self, request, pk=None):
        row = request.DATA.get('row')
        col = request.DATA.get('col')
        state = request.DATA.get('state')
        game = self.get_object()
        game.move(row, col, state)
        serializer = GameSerializer(instance=game)
        return Response(serializer.data)

    @detail_route(methods=['GET'])
    def reset(self, request, pk=None):
        game = self.get_object()
        game.reset()
        serializer = GameSerializer(instance=game)
        return Response(serializer.data)

class MoveViewSet(viewsets.ModelViewSet):
    queryset = Move.objects.all()
    serializer_class = MoveSerializer

