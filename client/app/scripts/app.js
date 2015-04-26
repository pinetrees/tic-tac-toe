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
  .constant('API_ENDPOINT', 'http://localhost:8000/api/');


