'use strict';

describe('Service: gameService', function () {

  // load the service's module
  beforeEach(module('TicTacToe'));

  // instantiate service
  var gameService;
  var httpBackend;
  var _API_ENDPOINT_;

  beforeEach(inject(function (_gameService_, $httpBackend, API_ENDPOINT) {
    gameService = _gameService_;
    httpBackend = $httpBackend;
    _API_ENDPOINT_ = API_ENDPOINT;
  }));

  it('should get us a game', function () {
    httpBackend.expectGET(_API_ENDPOINT_ + 'games/current').respond(200, 'Done');
    gameService.getCurrent().then(function(game) {
        console.log(game);
    });
    httpBackend.flush()
    expect(!!gameService).toBe(true);
  });

});
