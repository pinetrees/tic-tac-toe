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
        gameService.reset($scope.$parent.game).then(function(game) {
            $scope.$parent.game = game.data;
            $scope.player = _.findWhere($scope.$parent.players, {index: $scope.$parent.game.state});
            $scope.$parent.setBoard();
        });
    };

    $scope.simulateMove = function() {
        for ( var _i = 0; _i < $scope.$parent.specs.length; _i++ ) {
            for ( var _j = 0; _j < $scope.$parent.specs.length; _j++ ) {
                var play = Math.random() > 0.5;
                if( $scope.$parent.board[_i][_j] === 0 && play ) {
                    if ( !$scope.$parent.winner ) {
                        $scope.$parent.move(_i, _j);
                        return true;
                    }
                }
            }
        }
    };

    $scope.simulatePlay = function() {
        $scope.$parent.prepareGame();
        gameService.create({}).then(function(game) {
            $scope.$parent.game = game.data;
            $scope.$parent.setBoard();
            $rootScope.$interval = $interval(function() {
                if( $scope.$parent.winner ) {
                    $scope.$parent.stopInterval();
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

    $scope.flashScenario = function(board) {
        _.each(board, function(pair) {
            $scope.move(pair[0], pair[1], true);
        });
        console.log('just finished flashing');
        console.log($scope.$parent.board);
    };

    $scope.mapSequence = function(sequence) {
        var board = [];
        _.each(sequence, function(index) {
            board.push([Math.floor(index / 3), index % 3]);
        });
        return board;
    };

    //Don't call this. There's a third of a million games.
    $scope.simulateEveryGame = function() {
        $scope.$parent.intervals.playAll = true;
        var games = $scope.getPermutations([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        var k = 0;
        $rootScope.$interval = $interval(function() {
            if( k >= games.length ) {
                $scope.$parent.stopInterval();
                $rootScope.message = '';
            } else {
                $scope.reset();
                console.log('just reset');
                $rootScope.message = 'There are ' + (games.length - k).toString() + ' games left!';
                var board = $scope.mapSequence(games[k]);
                $scope.flashScenario(board);
                k++;
            }
        }, $scope.specs.flashSpeed);
    };


  });
