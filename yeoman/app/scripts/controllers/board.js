'use strict';

/**
 * @ngdoc function
 * @name TicTacToe.controller:BoardCtrl
 * @description
 * # BoardCtrl
 * Controller of the TicTacToe
 */
angular.module('TicTacToe')
  .controller('BoardCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
