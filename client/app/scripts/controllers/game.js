'use strict';

/**
 * @ngdoc function
 * @name TicTacToe.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the TicTacToe
 */
angular.module('TicTacToe')
  .controller('GameCtrl', function ($scope, $rootScope, $timeout, $interval, $routeParams, $resource, playerService, gameService) {

    var _ = window._;

    // SCOPE ATTRIBUTES
    // 1. specs
    // 2. game
    // 3. intervals
    // 4. queue
    // 5. moveInProgress
    // 6. keyCodes
    // 7. keyMappings
    // 8. players

    $scope.specs = {
        'length' : 3,
        'simulationSpeed' : 100,
        'flashSimulationSpeed' : 100,
        'flashSpeed' : 3000,
        'liveReloadSpeed': 800,
    };

    $scope.game = {};
    $scope.intervals = {};
    $scope.queue = [];
    $scope.moveInProgress = false;

    //I've supported speed tic-tac-toe for those with fast fingers. 
    $scope.keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57];
    $scope.keyMappings = {
        49: [2, 0],
        50: [2, 1],
        51: [2, 2],
        52: [1, 0],
        53: [1, 1],
        54: [1, 2],
        55: [0, 0],
        56: [0, 1],
        57: [0, 2],
    };

    $scope.players = [
        {'name': 'Player 1', 'index': 1, 'color': 'red', 'score': 0},
        {'name': 'Player 2', 'index': 2, 'color': 'blue', 'score': 0}
    ];

    // PLAYER METHODS
    // 1. setPlayers
    // 2. changePlayer
    // 3. declareWinner

    $scope.setPlayers = function() {
        playerService.query().then(function(players) {
            _.extend($scope.players[0], players[0]);
            _.extend($scope.players[1], players[1]);
        });
    };

    $scope.changePlayer = function() {
        if ($scope.currentPlayer.index === 1) {
            $scope.currentPlayer = $scope.players[1];
        } else {
            $scope.currentPlayer = $scope.players[0];
        }

        //Persistence.
        $scope.game.currentPlayer = $scope.currentPlayer.index;
    };

    $scope.declareWinner = function(playerIndex) {
        if ( !$scope.tie ) {
            $scope.winner = 'Player ' + playerIndex;
            $scope._winner = _.findWhere($scope.players, {index: playerIndex});
            $scope._winner.score += 1;
        } else {
            $scope.winner = 'Nobody';
        }
        $scope.status = 0;
        $scope.game.isComplete = true;
        return true;
    };


    // BOARD/GAME METHODS
    // 1. newBoard
    // 2. setBoard
    // 3. perpareGame
    // 4. createGame
    // 5. newGame

    $scope.newBoard = function() {
        return [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
    };

    $scope.setBoard = function() {
        $scope.board = $scope.newBoard();
        _.each($scope.game.moves, function(move) {
            $scope.board[move.row][move.col] = move.state;
        });
    };

    $scope.prepareGame = function() {
        delete $scope.winner;
        delete $scope.tie;
        $scope.currentPlayer = $scope.players[0];
        $scope.status = 1;
        $scope.board = $scope.newBoard();
    };

    $scope.createGame = function() {
        gameService.create().then(function(game) {
            $scope.game = game;
            $scope.setBoard();
        });
    };

    $scope.newGame = function() {
        $scope.prepareGame();

        //If our server is running, we want to run our new game through it.
        $scope.createGame();
    };


    // MOVE METHODS
    // 1. persistMove
    // 2. makeMove
    // 3. move
    //Defined separately so that it can be called recursively
    $scope.persistMove = function(move) {
        gameService.move($scope.game, move).then(function(game) {
            $scope.game = game.data;
            if($scope.queue.length > 0) {
                move = $scope.queue.pop();
                $scope.persistMove(move);
            } else {
                $scope.moveInProgress = false;
                $scope.message = '';
            }
        });
    };

    $scope.makeMove = function(row, col) {
        $scope.lastMove = {
            row: row,
            col: col,
            state: $scope.currentPlayer.index,
        };
        if ($scope.moveInProgress) {
            $scope.message = 'There is a move in progress. Your move has been queued.';
            $scope.queue.push($scope.lastMove);
        } else {
            $scope.moveInProgress = true;
            $scope.persistMove($scope.lastMove);
        }
    };

    $scope.move = function(row, col, persistless) {
        if( !$scope.status ) {
            return false;
        }

        if($scope.board[row][col] === 0) {
            $scope.board[row][col] = $scope.currentPlayer.index;
            //I once checked the entire board every time a player moved. I think we can do better.
            //$scope.checkGame()
            $scope.checkMove(row, col);

            //Persist this to the server
            if( persistless !== true  ) {
                $scope.makeMove(row, col);
            }

            if( $scope.winner ) {
                return true;
            }
            $scope.changePlayer();
        } else {
            //This position is already occupied
            return false;
        }

    };


    // LOGIC METHODS
    // 1. checkTuple
    // 2. checkTie
    // 3. checkGame
    // 4. checkMove

    $scope.checkTuple = function(tuple, bothPlayers, playerIndex) {
        if( $scope.winner ) {
            return true;
        }

        //If we're checking both players, we'll start with the first player.
        if( bothPlayers ) {
            playerIndex = 1;
        }

        var won = _.every(tuple, function(cell) {
            return cell === playerIndex;
        });

        if ( won ) {
            return $scope.declareWinner(playerIndex);
        }

        if( !$scope.winner && bothPlayers ) {
            return $scope.checkTuple(tuple, false, 2);
        }

        return false;
    };

    $scope.checkTie = function() {
        if( $scope.winner ) {
            return false;
        }
        if ( _.every( _.flatten( $scope.board ), _.identity ) ) {
            $scope.tie = true;
            return $scope.declareWinner();
        }
        return false;
    };

    //Stale
    $scope.checkGame = function() {
        //We need to make sure the game hasn't ended with a tie. 

        //There are three ways to win this game:
        //  1. Have a mark in every cell for a given row
        //  2. Have a mark in every cell for a given column
        //  3. For all i between 1 and n, with n the length of the matrix, have a mark in cell (i, i)

        //We'll start by looking through the rows
        for ( var i = 0; i < $scope.specs.length; i++ ) {
            
            $scope.counter = i;

            //We may have a winner. If this is the case, we'll break out
            if ( $scope.winner ) {
                break;
            }

            //We'll start by taking the first row
            var row = $scope.board[i];


            //If player one doesn't have all the cells in this row, we'll check the same for player 2
            $scope.checkTuple(row, true);

            //No one has won yet. Before we move to the next row, we'll check the associated column
            var col = $scope.makeColumn(i);


            //Similarly, if player one doesn't have all the cells in this column, we'll check the same for player 2
            $scope.checkTuple(col, true);

        }

        //If we don't have a winner yet, we still need to check the two cross sections
        $scope.setCrossSections();

        $scope.checkTuple($scope.crossSections[0], true);
        $scope.checkTuple($scope.crossSections[1], true);

        $scope.checkTie();
    };

    $scope.checkMove = function(rowIndex, colIndex) {

        //We only need to check for a single player, and we only need to check for possibilities relative to their last move. Much less work for us.
        var row = $scope.board[rowIndex];
        if ( $scope.checkTuple(row, false, $scope.currentPlayer.index) ) {
            return true;
        }

        var col = $scope.makeColumn(colIndex);
        if ( $scope.checkTuple(col, false, $scope.currentPlayer.index) ) {
            return true;
        }

        //If they're on the diagonal, we need to check the cross section. These happen to occur when the parity of the sum of the indicies is even. And yes, we can do better.
        var isCrossSection = ( ( rowIndex + colIndex ) % 2 ) === 0;
        if( !$scope.winner && isCrossSection ) {
            $scope.setCrossSections();
            if ( $scope.checkTuple($scope.crossSections[0], false, $scope.currentPlayer.index) ) {
                return true;
            } else if ( $scope.checkTuple($scope.crossSections[1], false, $scope.currentPlayer.index) ) {
                return true;
            }
        }

        //We'll run a simple check for a tie game.
        return $scope.checkTie();
    };


    // UTILITY METHODS
    // 1. makeColumn
    // 2. columnize
    // 3. setCrossSections
    // 4. moveByKey
    // 5. stopInterval
    // 6. stop
    // 7. playScenario
    // 8. awesomeness
    // 9. setLiveReload

    $scope.makeColumn = function(index) {
        return _.map($scope.board, function(row) { return row[index]; });
        //return _.map($scope.board, $scope.columnize);
    };

    $scope.columnize = function(row) {
        //Written this way to prevent defining a function inside a loop
        return row[$scope.counter];
    };

    $scope.setCrossSections = function() {
        $scope.crossSections = [
            [$scope.board[0][0], $scope.board[1][1], $scope.board[2][2]],
            [$scope.board[0][2], $scope.board[1][1], $scope.board[2][0]]
        ];
        return true;
    };
    $scope.moveByKey = function(e) {
        if( $scope.keyCodes.indexOf(e.keyCode) === -1 ) {
            return;
        }
        var position = $scope.keyMappings[e.keyCode];

        $scope.move(position[0], position[1]);
    };

    $scope.stopInterval = function() {
        $interval.cancel($rootScope.$interval);
        $rootScope.$interval = undefined;
    };

    $scope.stop = function(interval) {
        $interval.cancel(interval);
    };

    //This is stale
    $scope.playScenario = function(board) {
        $scope.newGame();
        var i = 0;
        $scope.$interval = $interval(function() {
            if( $scope.winner || i >= board.length ) {
                $scope.stopInterval();
            } else {
                var pair = board[i];
                $scope.move(pair[0], pair[1]);
                i++;
            }
        }, $scope.specs.simulationSpeed);
    };

    $scope.awesomeness = function(player) {
        var totalPoints = $scope.players[0].score + $scope.players[1].score;
        if( totalPoints === 0 ) {
            return 50;
        }
        var roughAwesomeness = player.score / totalPoints * 100;
        return roughAwesomeness;
    };

    
    $scope.setLiveReload = function() {
        $scope.$liveReloadInterval = $interval(function() {
            if( $scope.winner ) {
                //We'll let the team look at this as long as they want to.
                return true;
            }
            gameService.current().then(function(game) {
                if (game.data) {
                    //If the game hasn't changed, we'll leave things alone.
                    if (game.data.game_index === $scope.game.game_index) { 
                        return true;
                    } else {
                        $scope.game = game.data;
                        $scope.currentPlayer = _.findWhere($scope.players, {index: $scope.game.state});
                        $scope.setBoard();
                    }
                } else {
                    //We'll do nothing and let the game continue in peace.
                }
            });
        }, $scope.specs.liveReloadSpeed);
    };


    //And off to the races...

    //There is absolutely something going on here that needs attention.
    $scope.setPlayers();

    $scope.prepareGame();
    gameService.current().then(function(game) {
        if (game.data) {
            $scope.game = game.data;
            $scope.currentPlayer = _.findWhere($scope.players, {index: $scope.game.state});
            $scope.setBoard();
        } else {
            $scope.newGame();
        }

    });

  });
