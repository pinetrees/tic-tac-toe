'use strict';

/**
 * @ngdoc overview
 * @name yeomanApp
 * @description
 * # yeomanApp
 *
 * Main module of the application.
 */
angular
  .module('TicTacToe', [
    'angular-underscore',
     'colorpicker.module',
     'ngResource',
     'ngRoute',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'BoardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('API_ENDPOINT', 'http://127.0.0.1:8000/api/');

//}]);
//app.controller('MainCtrl', ['$scope', '$timeout', '$interval', '$routeParams', '$resource', 'playerService', 'gameService', function ($scope, $timeout, $interval, $routeParams, $resource, playerService, gameService) {
//
//    $scope.specs = {
//        'length' : 3,
//        'simulation_speed' : 150,
//        'flash_speed' : 2000,
//    }
//
//    $scope.game = {}
//    $scope.intervals = {}
//    $scope.queue = []
//    $scope.move_in_progress = false;
//
//    $scope.players = [
//        {'name': 'Player 1', 'index': 1, 'color': 'red', 'score': 0},
//        {'name': 'Player 2', 'index': 2, 'color': 'blue', 'score': 0}
//    ]
//
//    $scope.setPlayers = function() {
//        playerService.getPlayers().then(function(players) {
//            _.extend($scope.players[0], players.data[0])
//            _.extend($scope.players[1], players.data[1])
//        });
//    }
//
//    $scope.setPlayers()
//
//    $scope.newBoard = function() {
//        return [
//            [0, 0, 0],
//            [0, 0, 0],
//            [0, 0, 0],
//        ]
//    }
//
//    $scope.setBoard = function() {
//        $scope.board = $scope.newBoard();
//        _.each($scope.game.moves, function(move) {
//            $scope.board[move.row][move.col] = move.state;
//        });
//    }
//
//    $scope.setGame = function() {
//        $scope.game.a = $scope.board[0][0] 
//        $scope.game.b = $scope.board[0][1] 
//        $scope.game.c = $scope.board[0][2] 
//        $scope.game.d = $scope.board[1][0] 
//        $scope.game.e = $scope.board[1][1] 
//        $scope.game.f = $scope.board[1][2] 
//        $scope.game.g = $scope.board[2][0] 
//        $scope.game.h = $scope.board[2][1] 
//        $scope.game.i = $scope.board[2][2] 
//    }
//
//    $scope.makeMove = function(row, col) {
//        $scope.lastMove = {
//            row: row,
//            col: col,
//            state: $scope.player.index,
//        }
//        if ($scope.move_in_progress) {
//            $scope.message = "There is a move in progress. Your move has been queued."
//            $scope.queue.push($scope.lastMove);
//        } else {
//            $scope.move_in_progress = true;
//            $scope.persistMove($scope.lastMove)
//        }
//    }
//
//    //Defined separately so that it can be called recursively
//    $scope.persistMove = function(move) {
//        gameService.move($scope.game, move).then(function(game) {
//            $scope.game = game.data
//            console.log($scope.game.state)
//            if($scope.queue.length > 0) {
//                move = $scope.queue.pop();
//                $scope.persistMove(move);
//            } else {
//                $scope.move_in_progress = false;
//                $scope.message = ''
//            }
//        });
//    }
//
//    $scope.prepareGame = function() {
//        delete $scope.winner;
//        delete $scope.tie;
//        $scope.player = $scope.players[0];
//        $scope.status = 1;
//        $scope.board = $scope.newBoard();
//    }
//
//    $scope.newGame = function() {
//        $scope.prepareGame()
//
//        //If our server is running, we want to run our new game through it.
//        $scope.createGame();
//    }
//
//    $scope.createGame = function() {
//        gameService.create({}).then(function(game) {
//            $scope.game = game.data
//            $scope.setBoard()
//        });
//    }
//
//    
//    $scope.crossSections = function() {
//        return [
//            [$scope.board[0][0], $scope.board[1][1], $scope.board[2][2]],
//            [$scope.board[0][2], $scope.board[1][1], $scope.board[2][0]]
//        ]
//    }
//
//    $scope.setCrossSections = function() {
//        $scope.cross_sections = $scope.crossSections();
//    }
//
//    $scope.move = function(row, col, persistless) {
//        if( !$scope.status ) return false;
//
//        if($scope.board[row][col] == 0) {
//            $scope.board[row][col] = $scope.player.index;
//            //I once checked the entire board every time a player moved. I think we can do better.
//            //$scope.checkGame()
//            $scope.checkMove(row, col);
//
//            //Persist this to the server
//            if( persistless != true  ) {
//                $scope.setGame();
//                $scope.makeMove(row, col);
//            }
//
//            if( $scope.winner ) return true;
//            $scope.changePlayer()
//        } else {
//            //This position is already occupied
//            return false
//        }
//
//    }
//
//    $scope.changePlayer = function() {
//        if ($scope.player.index == 1) {
//            $scope.player = $scope.players[1];
//        } else {
//            $scope.player = $scope.players[0];
//        }
//
//        //Persistence.
//        $scope.game.current_player = $scope.player.index
//    }
//
//    $scope.declareWinner = function(player_index) {
//        if ( !$scope.tie ) {
//            $scope.winner = 'Player ' + player_index
//            $scope._winner = _.findWhere($scope.players, {index: player_index});
//            $scope._winner.score += 1;
//            //Let's persist their score to the server. They deserve it.
//            $scope.updatePlayer($scope._winner);
//        } else {
//            $scope.winner = 'Nobody'
//        }
//        $scope.status = 0;
//        $scope.game.is_complete = true;
//        return true;
//    }
//
//    $scope.reset = function(skip) {
//        gameService.reset($scope.game).then(function(game) {
//            $scope.game = game.data;
//            $scope.player = _.findWhere($scope.players, {index: $scope.game.state});
//            $scope.setBoard()
//        });
//    }
//
//    $scope.checkTuple = function(tuple, both_players, player_index) {
//        if( $scope.winner ) return true;
//
//        //If we're checking both players, we'll start with the first player.
//        if( both_players ) player_index = 1
//
//        won = _.every(tuple, function(cell) {
//            return cell == player_index;
//        }) 
//
//        if ( won ) $scope.declareWinner(player_index);
//
//        if( !$scope.winner && both_players ) $scope.checkTuple(tuple, false, 2);
//    }
//
//    $scope.checkTie = function() {
//        if( $scope.winner ) return false;
//        if ( _.every( _.flatten( $scope.board ), _.identity ) ) {
//            $scope.tie = true;
//            $scope.declareWinner();
//        }
//        return true;
//    }
//    $scope.checkGame = function() {
//        //We need to make sure the game hasn't ended with a tie. 
//
//        //There are three ways to win this game:
//        //  1. Have a mark in every cell for a given row
//        //  2. Have a mark in every cell for a given column
//        //  3. For all i between 1 and n, with n the length of the matrix, have a mark in cell (i, i)
//
//        //We'll start by looking through the rows
//        for ( i = 0; i < $scope.specs.length; i++ ) {
//            
//            //We may have a winner. If this is the case, we'll break out
//            if ( $scope.winner ) break;
//
//            //We'll start by taking the first row
//            row = $scope.board[i];
//
//
//            //If player one doesn't have all the cells in this row, we'll check the same for player 2
//            $scope.checkTuple(row, true);
//
//            //No one has won yet. Before we move to the next row, we'll check the associated column
//            col = _.map($scope.board, function(row) { return row[i]; });
//
//
//            //Similarly, if player one doesn't have all the cells in this column, we'll check the same for player 2
//            $scope.checkTuple(col, true);
//
//        }
//
//        //If we don't have a winner yet, we still need to check the two cross sections
//        $scope.setCrossSections();
//
//        $scope.checkTuple($scope.cross_sections[0], true);
//        $scope.checkTuple($scope.cross_sections[1], true);
//
//        $scope.checkTie()
//    }
//
//    $scope.checkMove = function(row_index, col_index) {
//
//        //We only need to check for a single player, and we only need to check for possibilities relative to their last move. Much less work for us.
//        row = $scope.board[row_index]
//        $scope.checkTuple(row, false, $scope.player.index);
//
//        col = $scope.makeColumn(col_index);
//        $scope.checkTuple(col, false, $scope.player.index);
//
//        //If they're on the diagonal, we need to check the cross section. These happen to occur when the parity of the sum of the indicies is even. And yes, we can do better.
//        is_cross_section = ( ( row_index + col_index ) % 2 ) == 0
//        if( !$scope.winner && is_cross_section ) {
//            $scope.setCrossSections();
//            $scope.checkTuple($scope.cross_sections[0], false, $scope.player.index);
//            $scope.checkTuple($scope.cross_sections[1], false, $scope.player.index);
//        }
//
//        //We'll run a simple check for a tie game.
//        $scope.checkTie();
//    }
//
//    $scope.makeColumn = function(index) {
//        return _.map($scope.board, function(row) { return row[index]; });
//    }
//
//    //I've supported speed tic-tac-toe for those with fast fingers. 
//    $scope.keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57]
//    $scope.keyMappings = {
//        49: [2, 0],
//        50: [2, 1],
//        51: [2, 2],
//        52: [1, 0],
//        53: [1, 1],
//        54: [1, 2],
//        55: [0, 0],
//        56: [0, 1],
//        57: [0, 2],
//    }
//    $scope.moveByKey = function(e) {
//        if( $scope.keyCodes.indexOf(e.keyCode) == -1 ) return;
//        position = $scope.keyMappings[e.keyCode];
//
//        $scope.move(position[0], position[1]);
//    }
//
//    $scope.updatePlayer = function(player) {
//        playerService.save(player);
//    }
//
//    $scope.simulatePlay = function() {
//        $scope.prepareGame();
//        gameService.create({}).then(function(game) {
//            $scope.game = game.data
//            $scope.setBoard()
//            $scope.$interval = $interval(function() {
//                if( $scope.winner ) {
//                    $scope.stopInterval();
//                } else {
//                    $scope.simulateMove();
//                }
//            }, $scope.specs.simulation_speed);
//        });
//    }
//
//    $scope.stopInterval = function() {
//        $interval.cancel($scope.$interval);
//        $scope.$interval = undefined;
//    }
//
//    $scope.stopPlayingEverything = function() {
//        $scope.stopInterval();
//        delete $scope.intervals.play_all
//        $scope.message = '';
//        $scope.newGame();
//    }
//
//    $scope.simulateMove = function() {
//        for ( _i = 0; _i < $scope.specs.length; _i++ ) {
//            for ( _j = 0; _j < $scope.specs.length; _j++ ) {
//                play = Math.random() > 0.5
//                if( $scope.board[_i][_j] == 0 && play ) {
//                    if ( !$scope.winner ) {
//                        $scope.move(_i, _j);
//                        return true;
//                    }
//                }
//            }
//        }
//    }
//
//    $scope.playScenario = function(board) {
//        $scope.newGame();
//        i = 0;
//        $scope.$interval = $interval(function() {
//            if( $scope.winner || i >= board.length ) {
//                $scope.stopInterval();
//            } else {
//                pair = board[i];
//                $scope.move(pair[0], pair[1]);
//                i++;
//            }
//        }, $scope.specs.simulation_speed);
//    }
//
//    $scope.flashScenario = function(board) {
//        _.each(board, function(pair) {
//            $scope.move(pair[0], pair[1], true);
//        });
//    }
//
//    $scope.getPermutations = function(input) {
//        
//        $scope.permArr = [];
//        $scope.usedChars = [];
//        return $scope.permute(input);
//
//    }
//
//    $scope.permute = function(input) {
//        var i, ch;
//        for (i = 0; i < input.length; i++) {
//          ch = input.splice(i, 1)[0];
//          $scope.usedChars.push(ch);
//          if (input.length == 0) {
//            $scope.permArr.push($scope.usedChars.slice());
//          }
//          $scope.permute(input);
//          input.splice(i, 0, ch);
//          $scope.usedChars.pop();
//        }
//        return $scope.permArr
//    }
//
//    $scope.mapSequence = function(sequence) {
//        board = [];
//        _.each(sequence, function(index) {
//            board.push([Math.floor(index / 3), index % 3])    
//        });
//        return board;
//    }
//
//    //Don't call this. There's a third of a million games.
//    $scope.playEverything = function() {
//        $scope.intervals.play_all = true;
//        games = $scope.getPermutations([0, 1, 2, 3, 4, 5, 6, 7, 8]);
//        k = 0;
//        $scope.$interval = $interval(function() {
//            if( k >= games.length ) {
//                $scope.stopInterval();
//            } else {
//                $scope.reset();
//                $scope.message = 'There are ' + (games.length - k).toString() + ' games left!'
//                board = $scope.mapSequence(games[k]);
//                $scope.flashScenario(board);
//                k++;
//            }
//        }, $scope.specs.flash_speed);
//    }
//
//    $scope.awesomeness = function(player) {
//        total_points = $scope.players[0].score + $scope.players[1].score;
//        if( total_points == 0 ) return 50;
//        rough_awesomeness = player.score / total_points * 100;
//        return rough_awesomeness;
//    }
//
//    $scope.clearGameHistory = function() {
//        gameService.deleteAll().then(function(data) {
//            $scope.setPlayers()
//            $scope.newGame();
//        });
//    }
//
//    //And off to the races...
//    $scope.prepareGame()
//    gameService.getCurrent().then(function(game) {
//        if (game.data) {
//            $scope.game = game.data
//            $scope.player = _.findWhere($scope.players, {index: $scope.game.state});
//            $scope.setBoard()
//        } else {
//            $scope.newGame()
//        }
//    });
//
//}]);
//
////We need an Angular directive to tap into the global key press events.
//app.directive('board', function() {
//  return {
//    restrict: 'E',
//    replace: true,
//    scope: true,
//    link:    function postLink(scope, iElement, iAttrs){
//      jQuery(document).on('keypress', function(e){
//         scope.$apply(scope.moveByKey(e));
//       });
//    }
//  };
//});
