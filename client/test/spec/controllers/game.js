'use strict';

describe('Controller: GameCtrl', function () {

  // load the controller's module
  beforeEach(module('TicTacToe'));

  var GameCtrl, scope, playerServiceMock, gameServiceMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {

    scope = $rootScope.$new();

    var players = [
        {'name': 'Player 1', 'index': 1, 'color': 'yellow', 'score': 0},
        {'name': 'Player 2', 'index': 2, 'color': 'green', 'score': 0}
    ];
    var game = {"id":171,"player_one":1,"player_two":2,"current_player":2,"game_index":1,"state":2,"winner":null,"is_complete":false,"moves":[{"id":1141,"game":171,"position":0,"row":0,"col":0,"game_index":1,"state":1}]};
    var move = {"game":171,"position":3,"row":1,"col":0,"game_index":2,"state":2};
    var new_game = {"id":172,"player_one":1,"player_two":2,"current_player":1,"game_index":0,"state":1,"winner":null,"is_complete":false,"moves":[]};

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
        }
    }

    spyOn(playerServiceMock, 'query').and.callThrough();
    spyOn(gameServiceMock, 'current').and.callThrough();
    spyOn(gameServiceMock, 'create').and.callThrough();
    spyOn(gameServiceMock, 'move').and.callThrough();

    GameCtrl = $controller('GameCtrl', {
      $scope: scope,
      playerService: playerServiceMock,
      gameService: gameServiceMock
    });
    //May not be necessary.
    scope.boardIsClean = function () {
        return ( _.some( _.flatten(scope.board), _.identity) == false );
    }
  }));

  it('should have a board with dimension three', function () {
    expect(scope.specs.length).toBe(3);
  });

  it('should not have a queue', function () {
    expect(scope.moveInProgress).toBe(false);
  });

  it('should have defined two players', function () {
    expect(scope.players.length).toBe(2);
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
    scope.changePlayer()
    expect(scope.currentPlayer.index).not.toBe(initialPlayerIndex)
    scope.changePlayer()
    expect(scope.currentPlayer.index).toBe(initialPlayerIndex)
  });

  it('should alternate players after each move', function () {
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
    expect(scope.winner).not.toBeUndefined();
    expect(scope.winner.score).toBe(initialScore + 1);
  });

  
  //BOARD/GAME METHODS
  it('should produce a fresh board on initialization', function () {
    expect(scope.boardIsClean()).toBe(true);
  });

  it('should produce a fresh board after movement', function () {
    scope.move(0, 0, true);
    scope.board = scope.newBoard();
    expect(scope.boardIsClean()).toBe(true);
  });

  it('should write the game moves after a fresh board', function () {
    scope.$apply();
    expect(gameServiceMock.current).toHaveBeenCalled();
    var fetchedBoard = scope.board;
    scope.board = scope.newBoard();
    expect(scope.boardIsClean()).toBe(true);
    scope.setBoard();
    expect(scope.board).toEqual(fetchedBoard);
  });

  it('should create and load a new game', function () {
    scope.$apply();
    var initialGameID = scope.game.id;

    expect(gameServiceMock.create).not.toHaveBeenCalled();
    scope.createGame();
    scope.$apply();

    expect(gameServiceMock.create).toHaveBeenCalled();
    expect(scope.game.id).not.toBe(initialGameID);
  });


  //MOVE METHODS
  it('should persist a move to the server', function () {
    var move = {"row":1,"col":0,"state":2};
    scope.$apply();

    scope.persistMove(move);
    scope.$apply();

    var new_move = scope.game.moves.pop();
    expect(new_move.row).toBe(move.row);
    expect(new_move.col).toBe(move.col);
    expect(new_move.state).toBe(move.state);
  });

  it('should wrap move persistence', function () {
    var moves = [{"row":1,"col":0,"state":2}, {"row":1,"col":1,"state":1}];
    scope.$apply();

    expect(scope.queue.length).toBe(0);

    scope.makeMove(moves[0]);
    scope.makeMove(moves[1]);

    expect(scope.moveInProgress).toBe(true);
    expect(scope.queue.length).toBe(1);

    scope.$apply();

    expect(scope.moveInProgress).toBe(false);
    expect(scope.queue.length).toBe(0);
  });

  it('should handle a movement', function () {
    var moves = [
        {"row":1,"col":0,"state":1},
        {"row":1,"col":0,"state":2},
        {"row":1,"col":1,"state":2},
    ];
    var initialPlayerIndex = scope.currentPlayer.index

    expect(scope.move(moves[0].row, moves[0].col)).toBe(true);
    expect(scope.currentPlayer.index).not.toBe(initialPlayerIndex)
    expect(scope.move(moves[1].row, moves[1].col)).toBe(false);
    expect(scope.currentPlayer.index).not.toBe(initialPlayerIndex)
    expect(scope.move(moves[2].row, moves[2].col)).toBe(true);
    expect(scope.currentPlayer.index).toBe(initialPlayerIndex)
  });


  //LOGIC METHODS
  it('should return false if there is already a winner', function () {
    scope.board = scope.newBoard();
    scope.winner = false;
    for ( var i = 0; i < 3; i++ ) {
        for ( var j = 0; j < 3; j++ ) {
            scope.board[i][j] = 1;
        }
    }
    scope.board[0][0] = 0;
    expect(scope.checkTie()).toBe(false);
    scope.board[0][0] = 1;
    expect(scope.checkTie()).toBe(true);
    scope.winner = true;
    expect(scope.checkTie()).toBe(false);
  });

  it('should return true for a uniform tuple', function () {
    var tuple = [1, 1, 1];
    expect(scope.checkTuple(tuple, false, 1)).toBe(true);
  });

  it('should return true for each of the winning positions', function () {
    var winningPositions = [
          //Rows
          [[0, 0], [0, 1], [0, 2]],
          [[1, 0], [1, 1], [1, 2]],
          [[2, 0], [2, 1], [2, 2]],

          //Columns
          [[0, 0], [1, 0], [2, 0]],
          [[0, 1], [1, 1], [2, 1]],
          [[0, 2], [1, 2], [2, 2]],

          //Cross sections
          [[0, 0], [1, 1], [2, 2]],
          [[0, 2], [1, 1], [2, 0]],
      ]

      _.each(winningPositions, function(tuple) {
          _.each(tuple, function(move) {
            scope.board[move[0]][move[1]] = 1;
          });
          expect(scope.checkMove(tuple[2][0], tuple[2][1])).toBe(true);
          scope.winner = false;
          expect(scope.checkGame()).toBe(true);
          scope.prepareGame();
      });

  });


  //UTILITY METHODS 
  it('should return the column specified by the given index', function () {
    scope.board = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ];

    expect(scope.makeColumn(0)).toEqual([0, 3, 6]);
    expect(scope.makeColumn(1)).toEqual([1, 4, 7]);
    expect(scope.makeColumn(2)).toEqual([2, 5, 8]);
  });

  it('should cache the cross sections of the board', function () {
    scope.board = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ];

    scope.setCrossSections();
    expect(scope.crossSections.length).toBe(2);
    expect(scope.crossSections[0]).toEqual([0, 4, 8]);
    expect(scope.crossSections[1]).toEqual([2, 4, 6]);
  });

  it('should perform the appropriate board move', function () {
    var e = {};
    _.each(scope.keyCodes, function(keyCode) {
        e.keyCode = keyCode;
        expect(scope.moveByKey(e)).toBe(true);
        expect(scope.moveByKey(e)).toBe(false);
        scope.prepareGame();
    });
    _.each(scope.keyCodes, function(keyCode) {
        e.keyCode = keyCode;
        if( scope.gameActive ) {
            expect(scope.moveByKey(e)).toBe(true);
        }
        expect(scope.moveByKey(e)).toBe(false);
    });
  });

  it('should return a number between 0 and 100, no matter what the players\' scores are', function () {
    scope.players[0].score = Math.random() / Math.random();
    scope.players[1].score = Math.random() / Math.random();
    expect(scope.awesomeness(scope.players[0]) >= 0).toBe(true);
    expect(scope.awesomeness(scope.players[0]) <= 100).toBe(true);
  });

  it('should set the live reload interval', function () {
    scope.setLiveReload();
    expect(scope.$liveReloadInterval).toBeDefined();
    expect(scope.setLiveReload()).toBe(false);
  });


  //INITIALIZATION
  it('should have set the players', function () {
    scope.$apply();
    expect(playerServiceMock.query).toHaveBeenCalled();
    expect(scope.players.length).toBe(2);
    expect(scope.players[0].color).toBe('yellow');
    expect(scope.players[1].color).toBe('green');
  });

  it('should have prepared the game', function () {
    expect(scope.winner).toBeUndefined();
    expect(scope.tie).toBeUndefined();
    expect(scope.gameActive).toBe(true);
    expect(scope.currentPlayer.index).toBe(1);
    expect(scope.boardIsClean()).toBe(true);
  });

  it('should have fetched a game', function () {
    scope.$apply();
    expect(scope.game.id).toBeDefined();
  });

  it('should have started the live reload', function () {
    scope.$apply();
    expect(scope.$liveReloadInterval).toBeDefined();
  });


});
