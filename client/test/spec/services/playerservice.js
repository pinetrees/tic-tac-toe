'use strict';

describe('Service: playerService', function () {

  // load the service's module
  beforeEach(module('TicTacToe'));

  // instantiate service
  var playerService;
  var httpBackend;
  var _API_ENDPOINT_;
  var data;


  beforeEach(inject(function (_playerService_, $httpBackend, API_ENDPOINT) {
    playerService = _playerService_;
    httpBackend = $httpBackend;
    _API_ENDPOINT_ = API_ENDPOINT;
  }));

  it('should return at least two players, with the appropriate attributes', function () {
    var players = [
        {'name': 'Player 1', 'index': 1, 'color': 'red', 'score': 0},
        {'name': 'Player 2', 'index': 2, 'color': 'blue', 'score': 0}
    ];

    httpBackend.expectGET(_API_ENDPOINT_ + 'players/').respond(players);

    playerService.query().then(function(result) {
        data = result.data
    });

    httpBackend.flush()
    expect(data).toEqual(players);
    expect(data.length).toBeGreaterThan(1);
  });

  it('should return a single player, with the appropriate attributes', function () {
    var player = {'id': 1, 'name': 'Player 1', 'index': 1, 'color': 'red', 'score': 0}

    httpBackend.expectGET(_API_ENDPOINT_ + 'players/' + player.id + '/').respond(player);

    playerService.get(1).then(function(result) {
        data = result.data
    });

    httpBackend.flush()
    expect(data).toEqual(player);
  });

  it('should update and return a single player, with the appropriate attributes', function () {
    var player = {'id': 1, 'name': 'Player 1', 'index': 1, 'color': 'red', 'score': 0}

    httpBackend.expectPUT(_API_ENDPOINT_ + 'players/' + player.id + '/').respond(player);

    playerService.save(player).then(function(result) {
        data = result.data
    });

    httpBackend.flush()
    expect(data).toEqual(player);
  });

});
