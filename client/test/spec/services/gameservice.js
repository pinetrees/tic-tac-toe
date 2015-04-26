'use strict';

describe('Service: gameService', function () {

  // load the service's module
  beforeEach(module('TicTacToe'));

  // instantiate service
  var gameService;
  var httpBackend;
  var _API_ENDPOINT_;
  var data;

  beforeEach(inject(function (_gameService_, $httpBackend, API_ENDPOINT) {
    gameService = _gameService_;
    httpBackend = $httpBackend;
    _API_ENDPOINT_ = API_ENDPOINT;
  }));

  it('should get us the current game', function () {
    var game = {"id":123,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]}

    httpBackend.expectGET(_API_ENDPOINT_ + 'games/current/').respond(game);

    gameService.current().then(function(result) {
        data = result.data
    });

    httpBackend.flush()
    expect(data).toEqual(game);
  });

  it('should create a new game', function () {
    var game = {"id":123,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]}

    httpBackend.expectGET(_API_ENDPOINT_ + 'games/new/').respond(game);

    gameService.create().then(function(result) {
        data = result
    });

    httpBackend.flush()
    expect(data).toEqual(game);
  });

  it('should persist the game to the server', function () {
    var game = {"id":123,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]}

    httpBackend.expectPUT(_API_ENDPOINT_ + 'games/' + game.id + '/').respond(game);

    gameService.save(game).then(function(result) {
        data = result.data
    });

    httpBackend.flush()
    expect(data).toEqual(game);
  });

  it('should delete all games from the database', function () {
    httpBackend.expectGET(_API_ENDPOINT_ + 'games/delete_all/').respond({});

    gameService.deleteAll().then(function(result) {
        data = result.data
    });

    httpBackend.flush()
    expect(data).toEqual({});
  });

  it('should persist a game move to the server', function () {
    var game = {"id":123,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]}
    var move = {'row':0, 'col':0, 'state':1}
    var updated_game = [{"id":123,"player_one":1,"player_two":2,"current_player":2,"game_index":1,"state":2,"winner":null,"is_complete":false,"moves":[{"id":950,"game":132,"position":0,"row":0,"col":0,"game_index":1,"state":1}]}]

    httpBackend.expectPOST(_API_ENDPOINT_ + 'games/' + game.id + '/move/').respond(updated_game);

    gameService.move(game, move).then(function(result) {
        data = result.data
    });

    httpBackend.flush()
    expect(data).toEqual(updated_game);
  });

  it('should reset the game back to the default values', function () {
    var default_game = {"id":123,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]}
    var game = [{"id":123,"player_one":1,"player_two":2,"current_player":2,"game_index":1,"state":2,"winner":null,"is_complete":false,"moves":[{"id":950,"game":132,"position":0,"row":0,"col":0,"game_index":1,"state":1}]}]

    httpBackend.expectGET(_API_ENDPOINT_ + 'games/' + game.id + '/reset/').respond(default_game);

    gameService.reset(game).then(function(result) {
        data = result.data
    });

    httpBackend.flush()
    expect(data).toEqual(default_game);
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingRequest();
    httpBackend.verifyNoOutstandingExpectation();
  });

});
