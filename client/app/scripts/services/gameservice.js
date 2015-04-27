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
        current: function() {
            var deferred = $q.defer();
            $http.get(API_ENDPOINT + 'games/current/').success(function(data){
                deferred.resolve(data);
            })
            .error(function(data, status){
            });
            return deferred.promise;
        },
        create: function() {
            var deferred = $q.defer();
            $http.get(API_ENDPOINT + 'games/new/').success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        save: function(game) {
            var deferred = $q.defer();
            $http.put(API_ENDPOINT + 'games/' + game.id + '/', game).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        deleteAll: function() {
            var deferred = $q.defer();
            $http.get(API_ENDPOINT + 'games/delete_all/').success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        move: function(game, move) {
            var deferred = $q.defer();
            $http.post(API_ENDPOINT + 'games/' + game.id + '/move/', move).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        reset: function(game) {
            var deferred = $q.defer();
            $http.get(API_ENDPOINT + 'games/' + game.id + '/reset/').success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
    return factory;
  }]);
