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
        if ($scope.$parent.usingServer) {
            playerService.save(player).then(function(data) {
                //I wish I could do this. Unfortunately, it will destroy the two way bind I need.
                //$scope.player = data;
            });
        }
        //We have to do this early, or else we'll run into an issue when switching between two of the player's inputs. Unfortunately, our request may be behind an update. This can be fixed by making the call to each player separately, and only making the call if isUpdating is false. The expense is an additional hit on the server for every interval.
        $scope.player.isUpdating = false;
    };

    $scope.$watch('player.score', function(newValue, oldValue) {
        //This will get us out of mostly everything, except the case where our player only has one point and we've just loaded the page. It is okay for today.
        if (newValue !== oldValue + 1) {
            return false;
        } else {
            $scope.player.isUpdating = true;
            if ($scope.$parent.usingServer) {
                playerService.save($scope.player).then(function(data) {
                    $scope.player.isUpdating = false;
                });
            }
        }
    });

  });
