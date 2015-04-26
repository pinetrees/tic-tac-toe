'use strict';

/**
 * @ngdoc service
 * @name TicTacToe.playerService
 * @description
 * # playerService
 * Service in the TicTacToe.
 */
angular.module('TicTacToe')
  .factory('playerService', ['$http', '$q', 'API_ENDPOINT', function($http, $q, API_ENDPOINT){
      var factory = {
          getPlayers: function() {
              var deferred = $q.defer();
              return $http.get(API_ENDPOINT + 'players/').success(function(data){
                  deferred.resolve(data);
              });
          },
          //This actually turns out to be pretty dangerous. Naturally.
          getPlayerOne: function() {
              var deferred = $q.defer();
              return $http.get(API_ENDPOINT + 'players/1/').success(function(data){
                  deferred.resolve(data);
              });
          },
          getPlayerTwo: function() {
              var deferred = $q.defer();
              return $http.get(API_ENDPOINT + 'players/2/').success(function(data){
                  deferred.resolve(data);
              });
          },
          save: function(player) {
              var deferred = $q.defer();
              return $http.put(API_ENDPOINT + 'players/' + player.id + '/', player).success(function(data){
                  deferred.resolve(data);
              });
          }
      };
      return factory;
  }]);
