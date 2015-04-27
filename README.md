# tic-tac-toe
##Client
1. npm install - its a little big due to karma / phantomjs
2. bower install
3. grunt serve

##Server
1. virtualenv env
2. source env/bin/activate
3. pip install -r requirements.txt
4. python manage.py makemigrations
5. python manage.py migrate
6. python manage.py runserver

##Features
* Player names
* Player icons
* Player colors
* Player scores
* Live reload for remote games
* Private games
* A performance bar
* A randomization feature

##Frameworks & Libraries
* Django
* AngularJS
* Grunt
* Bower
* Karma
* Jasmine
* Bootstrap

##Testing
* Basic unit tests on game model
* Basic unit testing on game endpoints
* Nearly exhaustive unit testing on 
1. The game controller
2. The action controller
3. The player controller
4. The game service
5. The player service

##Self criticism
* The tests are not comprehensive.
* The application is overdeveloped. Because of the number of features attempted, patches which represent poor style were included in the application. 
* There is an overabundance of resources. The application could stand to be much leaner.
* The controllers are not distributed well. The action controller is detrimentally dependent on the game controller.
* The game controller itself is too monolithic.
* Less than optimal time was spent on game logic. The logic itself would benefit greatly from being refactored, and studied a bit more comprehensively.

##Wishlist
* Multiple player sets
* Game selection
* Computer opponents
* Complete simulator
* User chat!

