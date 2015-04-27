'use strict';

describe('Controller: ActionCtrl', function () {

  // load the controller's module
  beforeEach(module('TicTacToe'));

  var ActionCtrl, GameCtrl, $parent, scope, playerServiceMock, gameServiceMock, $interval;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _$interval_) {
    $parent = $rootScope.$new();
    scope = $parent.$new();
    $interval = _$interval_;

    var players = [
        {'name': 'Player 1', 'index': 1, 'color': 'yellow', 'score': 0},
        {'name': 'Player 2', 'index': 2, 'color': 'green', 'score': 0}
    ];
    var game = {"id":171,"player_one":1,"player_two":2,"current_player":2,"game_index":1,"state":2,"winner":null,"is_complete":false,"moves":[{"id":1141,"game":171,"position":0,"row":0,"col":0,"game_index":1,"state":1}]};
    var move = {"game":171,"position":3,"row":1,"col":0,"game_index":2,"state":2};
    var new_game = {"id":172,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]};
    var reset_game = {"id":171,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]};

    var updated_game = game;
    updated_game.moves.push(move);

    playerServiceMock = {
        query: function() {
            var deferred = $q.defer();
            deferred.resolve(players);
            return deferred.promise;
        }
    }

    gameServiceMock = {
        current: function() {
            var deferred = $q.defer();
            deferred.resolve(game);
            return deferred.promise;
        },
        create: function() {
            var deferred = $q.defer();
            deferred.resolve(new_game);
            return deferred.promise;
        },
        move: function() {
            var deferred = $q.defer();
            deferred.resolve(updated_game);
            return deferred.promise;
        },
        reset: function() {
            var deferred = $q.defer();
            deferred.resolve(reset_game);
            return deferred.promise;
        },
        deleteAll: function() {
            var deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        },
        save: function(game) {
            var deferred = $q.defer();
            deferred.resolve(game);
            return deferred.promise;
        }
    }

    spyOn(playerServiceMock, 'query').and.callThrough();
    spyOn(gameServiceMock, 'current').and.callThrough();
    spyOn(gameServiceMock, 'create').and.callThrough();
    spyOn(gameServiceMock, 'move').and.callThrough();
    spyOn(gameServiceMock, 'reset').and.callThrough();
    spyOn(gameServiceMock, 'deleteAll').and.callThrough();
    spyOn(gameServiceMock, 'save').and.callThrough();

    GameCtrl = $controller('GameCtrl', {
      $scope: $parent,
      playerService: playerServiceMock,
      gameService: gameServiceMock
    });

    $parent.boardIsClean = function () {
        return ( _.some( _.flatten($parent.board), _.identity) == false );
    };

    ActionCtrl = $controller('ActionCtrl', {
      $scope: scope,
      gameService: gameServiceMock
    });

    scope.movesPlayed = function () {
        return _.filter( _.flatten(scope.$parent.board), _.identity ).length;
    };
  }));

  it('should have been instantiated with a game in the parent scope', function () {
    expect(scope.$parent.game).toBeDefined();
  });

  it('should reset the game', function () {
    scope.reset();
    expect(scope.$parent.winner).toBeUndefined();
    expect(scope.$parent.gameActive).toBe(true);
    
    scope.$apply();
    expect(scope.$parent.game.game_index).toBe(0);
    expect(scope.$parent.currentPlayer).toEqual(scope.$parent.players[0])
    expect(scope.boardIsClean()).toBe(true);
  });

  it('should simulate a move most of the time', function() {
    var initialMovesPlayed = scope.movesPlayed();
    if( scope.simulateMove() ) {
        expect(scope.movesPlayed()).toBe(initialMovesPlayed + 1);
    } else {
        expect(scope.movesPlayed()).toBe(initialMovesPlayed);
    }
  });

  it('it should simulate a game until completion', function () {
    expect(scope.$parent.winner).toBeUndefined();
    expect(scope.$parent.gameActive).toBe(true);
    expect(scope.$simulationInterval).toBeUndefined();
    scope.simulatePlay();
    scope.$apply();
    expect(scope.$simulationInterval).toBeDefined();
    $interval.flush( scope.$parent.specs.simulationSpeed * 18 );
    //This is extremely unlikely. 
    if( scope.$parent.gameActive ) {
        expect(scope.$simulationInterval).toBeDefined();
    } else {
        expect(scope.$parent.winner).toBeDefined();
    }
  });

  it('should reset both players\' score to 0', function () {
    scope.$parent.players[0].score = 1;
    scope.$parent.players[1].score = 1;
    scope.resetPlayerScores();
    expect(scope.$parent.players[0].score).toBe(0);
    expect(scope.$parent.players[1].score).toBe(0);
  });

  it('should delete all games and set up a new one', function () {
    gameServiceMock.deleteAll.calls.reset()
    playerServiceMock.query.calls.reset()
    gameServiceMock.create.calls.reset()
    scope.clearGameHistory();
    scope.$apply();
    expect(gameServiceMock.deleteAll).toHaveBeenCalled();
    //expect(playerServiceMock.query).toHaveBeenCalled();
    expect(scope.$parent.players[0].score).toBe(0);
    expect(scope.$parent.players[1].score).toBe(0);
    expect(gameServiceMock.create).toHaveBeenCalled();
  });

  it('should return all permutations of an array', function () {
    var list = [0, 1, 2, 3, 4];
    list = _.sortBy(list);
    var permutations = scope.getPermutations(list);
    var factorial = _.memoize( function(n) {
        if (n === 1) {
            return 1;
        } else {
            return n * factorial(n-1);
        }
    });
    expect(permutations.length).toBe(factorial(list.length));
    _.each(permutations, function(permutation) {
        expect(_.sortBy(permutation)).toEqual(list);
    });
  });

  it('should map a sequence of integers to a sequence of board positions', function () {
    var sequence = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var board = scope.mapSequence(sequence);
    _.each(board, function(pair, i) {
        expect(pair.length).toBe(2);
        expect(3*pair[0] + pair[1]).toBe(sequence[i]);
    });
  });

  it('should play out a game scenario, quickly', function () {
    scope.reset();
    var sequence = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var board = scope.mapSequence(sequence);
    expect(scope.$flashInterval).toBeUndefined();

    scope.flashScenario(board);

    expect(scope.$flashInterval).toBeDefined();
    $interval.flush( scope.$parent.specs.flashSimulationSpeed * 10 );
    expect(scope.$parent.winner).toBeDefined();
    expect(scope.$flashInterval).toBeUndefined();
  });

  it('should simulate at least the first several games with some level of correctness, but will not yet', function () {
    var testThisMany = 3;
    scope.reset();
    expect(scope.$completeSimulationInterval).toBeUndefined();
    expect(scope.$flashInterval).toBeUndefined();

    scope.simulateEveryGame();
    expect(scope.$completeSimulationInterval).toBeDefined();
    $interval.flush( scope.$parent.specs.flashInterval * testThisMany );
  });

  it('should stop the complete simulation', function () {
    expect(scope.$completeSimulationInterval).toBeUndefined();
    scope.simulateEveryGame();
    expect(scope.$completeSimulationInterval).toBeDefined();
    scope.stopCompleteSimulation();
    expect(scope.$completeSimulationInterval).toBeUndefined();
  });

  it('should tag/untag the current and future games with a private boolean to prevent/allow access from another window', function () {
    expect(scope.$parent.privatePlay).toBe(false);

    scope.togglePrivatePlay();
    expect(scope.$parent.privatePlay).toBe(true);
    expect(scope.$parent.game.is_private).toBe(true);
    expect(scope.$parent.$liveReloadInterval).toBeUndefined();

    scope.togglePrivatePlay();
    expect(scope.$parent.privatePlay).toBe(false);
    expect(scope.$parent.game.is_private).toBe(false);
    expect(scope.$parent.$liveReloadInterval).toBeDefined();
  });
});
