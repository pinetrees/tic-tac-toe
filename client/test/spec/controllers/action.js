'use strict';

describe('Controller: ActionCtrl', function () {

  // load the controller's module
  beforeEach(module('TicTacToe'));

  var ActionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActionCtrl = $controller('ActionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
