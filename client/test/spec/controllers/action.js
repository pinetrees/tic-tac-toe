'use strict';

describe('Controller: ActionCtrl', function () {

  // load the controller's module
  beforeEach(module('TicTacToe'));

  var ActionCtrl, GameCtrl, $parent, scope, gameServiceMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    $parent = $rootScope.$new();
    scope = $parent.$new();

    var game = {"id":171,"player_one":1,"player_two":2,"current_player":2,"game_index":1,"state":2,"winner":null,"is_complete":false,"moves":[{"id":1141,"game":171,"position":0,"row":0,"col":0,"game_index":1,"state":1}]};
    var reset_game = {"id":171,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]};

    _.extend(scope.$parent, {
        game: game,
        setBoard: function() {},
    });

    gameServiceMock = {
        reset: function() {
            var deferred = $q.defer();
            deferred.resolve(reset_game);
            return deferred.promise;
        }
    }

    spyOn(gameServiceMock, 'reset').and.callThrough();

    ActionCtrl = $controller('ActionCtrl', {
      $scope: scope,
      gameService: gameServiceMock
    });
  }));

  it('should have been instantiated with a game in the parent scope', function () {
    expect(scope.$parent.game).toBeDefined();
  });

  it('should reset the game', function () {
    scope.reset();
    expect(scope.$parent.winner).toBeUndefined();
    expect(scope.$parent.gameActive).toBe(true);
    
    scope.$apply();
  });
});
