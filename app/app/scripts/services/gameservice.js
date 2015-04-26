'use strict';

/**
 * @ngdoc service
 * @name TicTacToe.gameService
 * @description
 * # gameService
 * Service in the TicTacToe.
 */
angular.module('TicTacToe')
  .factory('gameService', ['$http', '$q', 'API_ENDPOINT', function($http, $q, API_ENDPOINT){
    // AngularJS will instantiate a singleton by calling "new" on this function
    var factory = {
        getCurrent: function() {
            var deferred = $q.defer();
            return $http.get(API_ENDPOINT + 'games/current').success(function(data){
                deferred.resolve(data);
            });
        },
        create: function(game) {
            var deferred = $q.defer();
            return $http.post(API_ENDPOINT + 'games/', {'game':game}).success(function(data){
                deferred.resolve(data);
            });
        },
        save: function(game) {
            var deferred = $q.defer();
            return $http.put(API_ENDPOINT + 'games/' + game.id + '/', game).success(function(data){
                deferred.resolve(data);
            });
        },
        deleteAll: function() {
            var deferred = $q.defer();
            return $http.get(API_ENDPOINT + 'games/delete_all/').success(function(data){
                deferred.resolve(data);
            });
        },
        move: function(game, move) {
            var deferred = $q.defer();
            return $http.post(API_ENDPOINT + 'games/' + game.id + '/move/', move).success(function(data){
                deferred.resolve(data);
            });
        },
        reset: function(game) {
            var deferred = $q.defer();
            return $http.post(API_ENDPOINT + 'games/' + game.id + '/reset/').success(function(data){
                deferred.resolve(data);
            });
        }
    };
    return factory;
  }]);
