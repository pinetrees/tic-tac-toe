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


  });
