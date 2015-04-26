'use strict';

describe('Controller: BoardCtrl', function () {

  // load the controller's module
  beforeEach(module('TicTacToe'));

  var BoardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BoardCtrl = $controller('BoardCtrl', {
      $scope: scope
    });
  }));

  it('should just be true', function () {
    expect(true).toBe(true);
  });
});
