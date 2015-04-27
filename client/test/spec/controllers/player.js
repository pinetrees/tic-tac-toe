'use strict';

describe('Controller: PlayerCtrl', function () {

  // load the controller's module
  beforeEach(module('TicTacToe'));

  var PlayerCtrl, playerServiceMock, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    scope.$parent.usingServer = true;

    var player = {'name': 'Player 1', 'index': 1, 'color': 'yellow', 'score': 0};

    playerServiceMock = {
        save: function(player) {
            var deferred = $q.defer();
            deferred.resolve(player);
            return deferred.promise;
        }
    }

    spyOn(playerServiceMock, 'save').and.callThrough();

    PlayerCtrl = $controller('PlayerCtrl', {
      $scope: scope,
      playerService: playerServiceMock
    });

    scope.player = player;
  }));

  it('should update the player', function () {
    scope.player.color = 'turquoise';
    scope.update(scope.player);

    scope.$apply();
    expect(scope.player.color).toBe('turquoise');
  });

  it('should persist the player\'s score to the server, albeit more than it should', function () {
    var playerUpdates = playerServiceMock.save.calls.count()
    scope.$apply();
    scope.player.score += 1;
    scope.$apply();
    expect(playerServiceMock.save.calls.count()).toBe(playerUpdates + 1);
  });
});
