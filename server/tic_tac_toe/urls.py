from django.conf.urls import patterns, include, url
from games.urls import register_games_urls
from players.urls import register_players_urls
from rest_framework import routers

router = routers.DefaultRouter()
register_games_urls(router)
register_players_urls(router)

urlpatterns = patterns('',
    url(r'^api/', include(router.urls)),
)
