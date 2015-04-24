app = angular.module('TicTacToe', [
            'angular-underscore',
            'colorpicker.module',
            'ngResource',
            'ngRoute',
      ]);
app.factory('playerService', ['$http', '$q', function($http, $q){
    var factory = {
        players: [],
        getAll: function() {
            deferred = $q.defer()
            return $http.get('http://localhost:3000/players.json').success(function(data){
                deferred.resolve(data)
            });
        },
        getPlayerOne: function() {
            deferred = $q.defer()
            return $http.get('http://localhost:3000/players/1.json').success(function(data){
                console.log(data)
                deferred.resolve(data)
            });
        },
        getPlayerTwo: function() {
            deferred = $q.defer()
            return $http.get('http://localhost:3000/players/2.json').success(function(data){
                deferred.resolve(data)
            });
        },
        save: function(player) {
            return $http.put('http://localhost:3000/players/' + player.id + '.json', player).success(function(data){
                console.log(data)
            });
        }
    }
    return factory;
}]);
app.controller('MainCtrl', ['$scope', '$timeout', '$routeParams', '$resource', 'playerService', function ($scope, $timeout, $routeParams, $resource, playerService) {

    $scope.specs = {
        'length' : 3
    }

    $scope.players = [
        {'name': 'Player 1', 'index': 1, 'color': 'red', 'score': 0},
        {'name': 'Player 2', 'index': 2, 'color': 'blue', 'score': 0}
    ]

    playerService.getPlayerOne().then(function(player) {
        _.extend($scope.players[0], player.data)
    });

    playerService.getPlayerTwo().then(function(player) {
        _.extend($scope.players[1], player.data)
    });

    $scope.newBoard = function() {
        return [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]
    }

    $scope.game = function() {
        delete $scope.winner;
        delete $scope.tie;
        $scope.player = $scope.players[0];
        $scope.status = 1;
        $scope.board = $scope.newBoard();
    }

    $scope.game()
    
    $scope.crossSections = function() {
        return [
            [$scope.board[0][0], $scope.board[1][1], $scope.board[2][2]],
            [$scope.board[0][2], $scope.board[1][1], $scope.board[2][0]]
        ]
    }

    $scope.setCrossSections = function() {
        $scope.cross_sections = $scope.crossSections();
    }

    $scope.move = function(row, col) {
        if( !$scope.status ) return false;

        if($scope.board[row][col] == 0) {
            $scope.board[row][col] = $scope.player.index;
            $scope.checkGame()
            if( $scope.winner ) return true;
            $scope.changePlayer()
        }
    }

    $scope.changePlayer = function() {
        if ($scope.player.index == 1) {
            $scope.player = $scope.players[1];
        } else {
            $scope.player = $scope.players[0];
        }
    }

    $scope.declareWinner = function(player_index) {
        if ( !$scope.tie ) {
            $scope.winner = 'Player ' + player_index
            $scope._winner = _.findWhere($scope.players, {index: player_index});
            $scope._winner.score += 1;
            //Let's persist their score to the server. They deserve it.
            $scope.updatePlayer($scope._winner);
        } else {
            $scope.winner = 'Nobody'
        }
        $scope.status = 0;
        return true;
    }

    $scope.checkTuple = function(tuple, player_index) {
        won = _.every(tuple, function(cell) {
            return cell == player_index;
        }) 

        if ( won ) $scope.declareWinner(player_index);
    }


    $scope.checkGame = function() {
        //We need to make sure the game hasn't ended with a tie
        if ( _.every( _.flatten( $scope.board ), _.identity ) ) {
            $scope.tie = true;
            $scope.declareWinner();
        }

        //There are three ways to win this game:
        //  1. Have a mark in every cell for a given row
        //  2. Have a mark in every cell for a given column
        //  3. For all i between 1 and n, with n the length of the matrix, have a mark in cell (i, i)

        //We'll start by looking through the rows
        for ( i = 0; i < $scope.specs.length; i++ ) {
            
            //We may have a winner. If this is the case, we'll break out
            if ( $scope.winner ) break;

            //We'll start by taking the first row
            row = $scope.board[i];


            //If player one doesn't have all the cells in this row, we'll check the same for player 2
            $scope.checkTuple(row, 1);
            $scope.checkTuple(row, 2);

            //No one has won yet. Before we move to the next row, we'll check the associated column
            col = _.map($scope.board, function(row) { return row[i]; });


            //Similarly, if player one doesn't have all the cells in this column, we'll check the same for player 2
            $scope.checkTuple(col, 1);
            $scope.checkTuple(col, 2);

        }

        //If we don't have a winner yet, we still need to check the two cross sections
        $scope.setCrossSections();

        $scope.checkTuple($scope.cross_sections[0], 1);
        $scope.checkTuple($scope.cross_sections[0], 2);

        $scope.checkTuple($scope.cross_sections[1], 1);
        $scope.checkTuple($scope.cross_sections[1], 2);

    }

    //I've supported speed tic-tac-toe for those with fast fingers. 
    $scope.keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57]
    $scope.keyMappings = {
        49: [2, 0],
        50: [2, 1],
        51: [2, 2],
        52: [1, 0],
        53: [1, 1],
        54: [1, 2],
        55: [0, 0],
        56: [0, 1],
        57: [0, 2],
    }
    $scope.moveByKey = function(e) {
        if( $scope.keyCodes.indexOf(e.keyCode) == -1 ) return;
        position = $scope.keyMappings[e.keyCode];

        $scope.move(position[0], position[1]);
    }

    $scope.updatePlayer = function(player) {
        playerService.save(player);
    }

    $scope.simulatePlay = function() {
        $scope.game();        
        while ( !$scope.winner ) {
            for ( _i = 0; _i < $scope.specs.length; _i++ ) {
                for ( _j = 0; _j < $scope.specs.length; _j++ ) {
                    play = Math.random() > 0.5
                    if( $scope.board[_i][_j] == 0 && play ) {
                        if ( !$scope.winner ) {
                            $scope.move(_i, _j);
                        }
                    }
                }
            }
        }
    }

    $scope.awesomeness = function(player) {
        total_points = $scope.players[0].score + $scope.players[1].score;
        if( total_points == 0 ) return 50;
        rough_awesomeness = player.score / total_points * 100;
        return rough_awesomeness;
    }
}]);

//We need an Angular directive to tap into the global key press events.
app.directive('board', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    link:    function postLink(scope, iElement, iAttrs){
      jQuery(document).on('keypress', function(e){
         scope.$apply(scope.moveByKey(e));
       });
    }
  };
});
