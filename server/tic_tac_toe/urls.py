from django.conf.urls import patterns, include, url
from board.urls import register_board_urls
from players.urls import register_players_urls
from rest_framework import routers

router = routers.DefaultRouter()
register_board_urls(router)
register_players_urls(router)

urlpatterns = patterns('',
    url(r'^api/', include(router.urls)),
)
