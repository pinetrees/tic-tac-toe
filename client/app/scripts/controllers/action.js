'use strict';

/**
 * @ngdoc function
 * @name TicTacToe.controller:ActionCtrl
 * @description
 * # ActionCtrl
 * Controller of the TicTacToe
 */
angular.module('TicTacToe')
  .controller('ActionCtrl', function ($scope, $rootScope, $interval, gameService) {

    var _ = window._;

    $scope.reset = function() {
        delete $scope.$parent.winner;
        $scope.$parent.gameActive = true;

        gameService.reset($scope.$parent.game).then(function(data) {
            $scope.$parent.game = data;
            $scope.$parent.currentPlayer = _.findWhere($scope.$parent.players, {index: $scope.$parent.game.state});
            $scope.$parent.setBoard();
        });
    };

    $scope.simulateMove = function() {
        for ( var _i = 0; _i < $scope.$parent.specs.length; _i++ ) {
            for ( var _j = 0; _j < $scope.$parent.specs.length; _j++ ) {
                var play = Math.random() > 0.5;
                if( $scope.$parent.board[_i][_j] === 0 && play ) {
                    if ( !$scope.$parent.winner ) {
                        return $scope.$parent.move(_i, _j, true);
                    }
                }
            }
        }
        return false;
    };

    $scope.simulatePlay = function() {
        $scope.reset();
        gameService.create({}).then(function(game) {
            $scope.$parent.game = game;
            $scope.$parent.setBoard();
            $scope.$simulationInterval = $interval(function() {
                if( $scope.$parent.winner ) {
                    $scope.$parent.stopInterval($scope.$simulationInterval);
                } else {
                    $scope.simulateMove();
                }
            }, $scope.$parent.specs.simulationSpeed);
        });
    };

    $scope.clearGameHistory = function() {
        gameService.deleteAll().then(function() {
            $scope.$parent.setPlayers();
            $scope.$parent.newGame();
        });
    };

    $scope.permute = function(input) {
        var i, ch;
        for (i = 0; i < input.length; i++) {
          ch = input.splice(i, 1)[0];
          $scope.usedChars.push(ch);
          if (input.length === 0) {
            $scope.permArr.push($scope.usedChars.slice());
          }
          $scope.permute(input);
          input.splice(i, 0, ch);
          $scope.usedChars.pop();
        }
        return $scope.permArr;
    };

    $scope.getPermutations = function(input) {
        
        $scope.permArr = [];
        $scope.usedChars = [];
        return $scope.permute(input);

    };

    $scope.mapSequence = function(sequence) {
        var board = [];
        _.each(sequence, function(index) {
            board.push([Math.floor(index / 3), index % 3]);
        });
        return board;
    };

    $scope.flashScenario = function(board) {
        $scope.$flashInterval = $interval(function() {
            var pair = board.shift();
            if( $scope.$parent.winner || board.length === 0 ) {
                $scope.$parent.stopInterval($scope.$flashInterval);
                delete $scope.$flashInterval;
            } else {
                $scope.$parent.move(pair[0], pair[1], true);
            }
        }, $scope.$parent.specs.flashSimulationSpeed);
    };

    $scope.simulateEveryGame = function() {
        $scope.intervals.playAll = true;
        $rootScope.message = 'Just a moment...';
        var games = $scope.getPermutations([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        var k = 0;
        $scope.$completeSimulationInterval = $interval(function() {
            if( k >= games.length ) {
                $scope.stopCompleteSimulation()
            } else if ( typeof($scope.$flashInterval) !== 'undefined' ) {
                //Do nothing
            } else {
                $scope.reset();
                $rootScope.message = 'There are ' + (games.length - k).toString() + ' games left!';
                var board = $scope.mapSequence(games[k]);
                console.log(board);
                $scope.flashScenario(board);
                k++;
            }
        }, $scope.specs.flashInterval);
    };

    $scope.stopCompleteSimulation = function() {
        $scope.$parent.stopInterval($scope.$completeSimulationInterval);
        delete $scope.intervals.playAll;
        $scope.message = '';
        $scope.$parent.newGame();
    };

    $scope.togglePrivatePlay = function() {
        $scope.$parent.privatePlay = !$scope.$parent.privatePlay;
        $scope.$parent.game.is_private = $scope.$parent.privatePlay;
        if ( $scope.$parent.privatePlay ) {
            $scope.$parent.stopInterval($scope.$parent.$liveReloadInterval);
            delete $scope.$parent.$liveReloadInterval;
        } else {
            $scope.$parent.setLiveReload();
        }
        gameService.save($scope.$parent.game).then(function(data) {
            console.log(data);
            $scope.$parent.game = data;
        });
    };


  });
