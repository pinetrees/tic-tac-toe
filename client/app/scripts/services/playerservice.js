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
          query: function() {
              var deferred = $q.defer();
              return $http.get(API_ENDPOINT + 'players/').success(function(data){
                  deferred.resolve(data);
              });
          },
          get: function(player) {
              var deferred = $q.defer();
              return $http.get(API_ENDPOINT + 'players/' + player + '/').success(function(data){
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
