'use strict';

describe('Directive: board', function () {

  // load the directive's module
  beforeEach(module('TicTacToe'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<board></board>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the board directive');
  }));
});
