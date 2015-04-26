'use strict';

/**
 * @ngdoc directive
 * @name TicTacToe.directive:board
 * @description
 * # board
 */
angular.module('TicTacToe')
  .directive('board', function () {
    var jQuery = window.jQuery;

    return {
        restrict: 'E',
        replace: true,
        scope: true,
        link:    function postLink(scope){
          jQuery(document).on('keypress', function(e){
             scope.$apply(scope.moveByKey(e));
           });
        }
    };
  });
