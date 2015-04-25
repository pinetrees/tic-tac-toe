from rest_framework import viewsets, permissions, generics, views
from rest_framework.parsers import FileUploadParser
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from .serializers import *


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class MoveViewSet(viewsets.ModelViewSet):
    queryset = Move.objects.all()
    serializer_class = MoveSerializer

