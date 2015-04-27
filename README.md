# tic-tac-toe

##Server
#chmod +x build.sh && ./build.sh, or just:
1. cd server && virtualenv env
2. source env/bin/activate
3. pip install -r requirements.txt
4. python manage.py test
5. python manage.py makemigrations
6. python manage.py migrate
7. python manage.py loaddata fixtures/players.Player.json
7. python manage.py runserver

##Client
1. cd client && npm install - its a little big due to karma / phantomjs
2. bower install
3. grunt serve

##Features
* Player colors
* Player names
* Player scores
* Live reload for remote games
* Client side logic to compliment the server
* Private games
* A performance bar
* A randomization feature

##Libraries
* Django
* AngularJS
* Grunt
* Bower
* Karma
* Jasmine

##Wishlist
* User icon selection (http://mjolnic.com/fontawesome-iconpicker/)
* Live player update
* Multiple player sets
* Game selection
* Computer opponents
* Complete simulator
* User chat!

