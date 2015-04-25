from rest_framework import viewsets, permissions, generics, views
from rest_framework.parsers import FileUploadParser
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from .serializers import *


class CellViewSet(viewsets.ModelViewSet):
    queryset = Cell.objects.all()
    serializer_class = CellSerializer


class CellStateViewSet(viewsets.ModelViewSet):
    queryset = CellState.objects.all()
    serializer_class = CellStateSerializer


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class BoardTemplateViewSet(viewsets.ModelViewSet):
    queryset = BoardTemplate.objects.all()
    serializer_class = BoardTemplateSerializer

