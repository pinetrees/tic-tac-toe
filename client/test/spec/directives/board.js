'use strict';

describe('Directive: board', function () {

  // load the directive's module
  beforeEach(module('TicTacToe'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should just be true', inject(function ($compile) {
    element = angular.element('<board></board>');
    element = $compile(element)(scope);
    expect(true).toBe(true);
  }));
});
