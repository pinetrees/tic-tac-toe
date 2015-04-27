'use strict';

/**
 * @ngdoc function
 * @name TicTacToe.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the TicTacToe
 */
angular.module('TicTacToe')
  .controller('PlayerCtrl', function ($scope, playerService) {
    //We don't need to pass the player in, since they are already attached to the scope. I haven't had a chance to refactor this yet.
    $scope.update = function(player) {
        playerService.save(player).then(function(data) {
            $scope.player = data;
        });
    };

    $scope.$watch('player.score', function(newValue, oldValue) {
        //This will get us out of mostly everything, except the case where our player only has one point and we've just loaded the page. It is okay for today.
        if (newValue !== oldValue + 1) {
            return false;
        } else {
            playerService.save($scope.player);
        }
    });

  });
