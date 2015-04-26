'use strict';

describe('Controller: GameCtrl', function () {

  // load the controller's module
  beforeEach(module('TicTacToe'));

  var GameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GameCtrl = $controller('GameCtrl', {
      $scope: scope
    });
    //May not be necessary.
    scope.boardIsClean = function () {
        return ( _.some( _.flatten(scope.board), _.identity) == false );
    }
  }));

  it('should just be 3', function () {
    expect(scope.specs.length).toBe(3);
  });

  it('should not be queued', function () {
    expect(scope.moveInProgress).toBe(false);
  });

  it('should produce a fresh board for testing', function () {
    expect(scope.boardIsClean()).toBe(true);
  });

  it('should change the current player', function () {
    var startingPlayer = scope.currentPlayer
    expect(scope.currentPlayer.index).toBe(1);
    scope.move(0, 0, true);
    expect(scope.currentPlayer.index).toBe(2);
  });

  it('should have an empty game', function () {
    expect(_.isEmpty(scope.game)).toBe(true);
  });

  it('should produce a fresh board after movement', function () {
    scope.move(0, 0, true);
    scope.setBoard();
    expect(scope.boardIsClean()).toBe(true);
  });

  it('should respond to all possible first moves', function () {
    for ( var i = 0; i < 3; i++ ) {
        for ( var j = 0; j < 3; j++ ) {
            scope.move(i, j, true);
            expect(scope.board[i][j]).toBe(1);
            scope.prepareGame();
        }
    }
  });

  it('should not allow the same move to be made', function () {
    scope.move(0, 0, true);
    expect(scope.move(0, 0, true)).toBe(false);
  });

  it('should present a victory along the first row after five moves', function () {
    scope.move(0, 0, true);
    expect(scope.winner).toBeUndefined()
    scope.move(1, 0, true);
    expect(scope.winner).toBeUndefined()
    scope.move(0, 1, true);
    expect(scope.winner).toBeUndefined()
    scope.move(1, 2, true);
    expect(scope.winner).toBeUndefined()
    scope.move(0, 2, true);
    expect(scope.winner).toBeTruthy()
  });

  it('should alternate players', function () {
    var initialPlayerIndex = scope.currentPlayer.index
    scope.move(0, 0, true);
    expect(scope.currentPlayer.index).not.toBe(initialPlayerIndex)
    scope.move(1, 0, true);
    expect(scope.currentPlayer.index).toBe(initialPlayerIndex)
    scope.move(0, 1, true);
    expect(scope.currentPlayer.index).not.toBe(initialPlayerIndex)
    scope.move(1, 2, true);
    expect(scope.currentPlayer.index).toBe(initialPlayerIndex)
    scope.move(0, 2, true);
  });

  it('should increase the first player\'s score by one', function () {
    var initialScore = scope.currentPlayer.score;
    scope.move(0, 0, true);
    scope.move(1, 0, true);
    scope.move(0, 1, true);
    scope.move(1, 2, true);
    scope.move(0, 2, true);
    expect(scope._winner).not.toBeUndefined();
    expect(scope._winner.score).toBe(initialScore + 1);
  });


});
