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
        'flashInterval' : 3000,
        'liveReloadSpeed': 800,
    };

    $scope.game = {};
    $scope.intervals = {};
    $scope.lastMove = {};
    $scope.queue = [];
    $scope.moveInProgress = false;
    $scope.privatePlay = false;
    $scope.usingServer = true;

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

    // PLAYER METHODS
    // 1. setPlayers
    // 2. changePlayer
    // 3. declareWinner

    $scope.setPlayers = function() {
        $scope.players = [
            {'name': 'Player 1', 'index': 1, 'color': 'red', 'score': 0},
            {'name': 'Player 2', 'index': 2, 'color': 'blue', 'score': 0}
        ];
        if ($scope.usingServer) {
            playerService.query().then(function(players) {
                _.extend($scope.players[0], players[0]);
                _.extend($scope.players[1], players[1]);
            });
        }
    };

    $scope.changePlayer = function() {
        if ($scope.currentPlayer.index === 1) {
            $scope.currentPlayer = $scope.players[1];
        } else {
            $scope.currentPlayer = $scope.players[0];
        }

        $scope.game.current_player = $scope.currentPlayer.index;
    };

    $scope.declareWinner = function(playerIndex) {
        if ( !$scope.tie ) {
            $scope.winner = _.findWhere($scope.players, {index: playerIndex});
            $scope.winner.score += 1;
        } else {
            $scope.winner = {};
        }
        $scope.gameActive = false;
        $scope.game.is_complete = true;
        return true;
    };


    // BOARD/GAME METHODS
    // 1. newBoard
    // 2. setBoard
    // 3. prepareGame
    // 4. createGame
    // 5. newGame
    // 6. fetchGame

    // This method simply returns a fresh board.
    $scope.newBoard = function() {
        return [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
    };

    // Used after a game has been returned from the server, to load the moves into the board.
    $scope.setBoard = function() {
        $scope.board = $scope.newBoard();
        _.each($scope.game.moves, function(move) {
            $scope.board[move.row][move.col] = move.state;
        });
    };

    // Reset our default attributes.
    $scope.prepareGame = function() {
        delete $scope.winner;
        delete $scope.tie;
        $scope.gameActive = true;
        $scope.currentPlayer = $scope.players[0];
        $scope.board = $scope.newBoard();
    };

    //A wrapper to generate a new game from the server.
    $scope.createGame = function() {
        if ($scope.usingServer) {
            gameService.create().then(function(game) {
                $scope.game = game;
                $scope.setBoard();
            });
        }
    };

    // Take both the client and server side actions to prepare for a new game.
    $scope.newGame = function() {
        $scope.prepareGame();

        //If our server is running, we want to run our new game through it.
        $scope.createGame();
    };

    //Attempt to get the most recent game off of the server. If no incomplete game exists, start a new one.
    $scope.fetchGame = function() {
        if ($scope.usingServer) {
            gameService.current().then(function(game) {
                if (game) {
                    $scope.game = game;
                    $scope.currentPlayer = _.findWhere($scope.players, {index: $scope.game.state});
                    $scope.setBoard();
                } else {
                    $scope.newGame();
                }
            });
        } else {
            $scope.newGame();
        }
    }

    // MOVE METHODS
    // 1. persistMove
    // 2. makeMove
    // 3. move
    // This method handles persisting game moves to the server. It is defined separately from makeMove so that it can be called recursively, if we have a queue
    $scope.persistMove = function(move) {
        if ($scope.usingServer) {
            gameService.move($scope.game, move).then(function(game) {
                $scope.game = game;
                if($scope.queue.length > 0) {
                    move = $scope.queue.pop();
                    $scope.persistMove(move);
                } else {
                    $scope.moveInProgress = false;
                    $scope.message = '';
                }
            });
        }
    };

    // This method starts the action of persisting a move to the server. It is coupled with persistMove, to handle a queue, should we have fast action.
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

    // The method to handle making a move on a give row and column. The scope already knows who is making the move. We give the option to keep the move from persisting to the server for simulation or client-only play.
    $scope.move = function(row, col, persistless) {
        if( !$scope.gameActive ) {
            return false;
        }

        //If the position is open, we make the move. Otherwise, we return false.
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

            return true;
        } else {
            //This position is already occupied
            return false;
        }

    };


    // LOGIC METHODS
    // 1. checkTie
    // 2. checkTuple
    // 3. checkMove
    // 4. checkGame

    // A simple check for a tie, by verifying that 1) we have no winner and 2) every position has been occupied. Note that this does not uncover impending ties.
    $scope.checkTie = function() {
        if( $scope.winner ) {
            return false;
        } else if ( _.every( _.flatten( $scope.board ), _.identity ) ) {
            $scope.tie = true;
            return $scope.declareWinner();
        } else {
            return false;
        }
    };

    // This is our atomic, client-side state verification. There are precisely eight possible board tuples which can win the game. This method checks to see if every value of a given tuple has a given player's index. If this is the case, the player has won. If we are checking the entire game, it is sensible to check both players on each tuple, since we have already done the work to structure the tuple. In this case, we pass true for bothPlayers, and the method will execute up to one time for each player.
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

    //This method checks between one and four tuples after each move to see if the player has made a winning play.
    $scope.checkMove = function(rowIndex, colIndex) {

        //We only need to check for a single player, and we only need to check for possibilities relative to their last move. 
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

    //Antiquated, but kept around for the ideas it inspired.
    $scope.checkGame = function() {
        //We need to make sure the game hasn't ended with a tie. 

        //There are three ways to win this game:
        //  1. Have a mark in every cell for a given row
        //  2. Have a mark in every cell for a given column
        //  3. For all i between 1 and n, with n the length of the matrix, have a mark in cell (i, i)

        //We'll start by looking through the rows
        for ( var i = 0; i < $scope.specs.length; i++ ) {
            
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
        
        if ( $scope.winner ) {
            return true;
        } else {
            return false;
        }
    };


    // UTILITY METHODS
    // 1. makeColumn
    // 2. setCrossSections
    // 3. moveByKey
    // 4. stopInterval
    // 5. playScenario
    // 6. awesomeness
    // 7. setLiveReload

    // Extracts the i-th column from the board.
    $scope.makeColumn = function(i) {
        return _.map($scope.board, function(row) { return row[i]; });
        //return _.map($scope.board, $scope.columnize);
    };

    // Statically computes the current cross section tuples.
    $scope.setCrossSections = function() {
        $scope.crossSections = [
            [$scope.board[0][0], $scope.board[1][1], $scope.board[2][2]],
            [$scope.board[0][2], $scope.board[1][1], $scope.board[2][0]]
        ];
        return true;
    };

    // Allows our players to use the number keys to move. 
    $scope.moveByKey = function(e) {
        if( $scope.keyCodes.indexOf(e.keyCode) === -1 ) {
            return false;
        }
        var position = $scope.keyMappings[e.keyCode];

        return $scope.move(position[0], position[1]);
    };

    // Cancels an interval representing a repeating process: simulation, live reload, etc.
    $scope.stopInterval = function(interval) {
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

    // Handles computation for the awesomeness bar, which pins the two player's scores against each other.
    $scope.awesomeness = function(player) {
        var totalPoints = $scope.players[0].score + $scope.players[1].score;
        if( totalPoints === 0 ) {
            return 50;
        }
        var roughAwesomeness = player.score / totalPoints * 100;
        return roughAwesomeness;
    };

    
    // Starts continuous, real-time game updating, allowing players to play from remote locations, and so forth.
    $scope.setLiveReload = function() {
        if ( $scope.$liveReloadInterval ) {
            return false;
        }
        $scope.$liveReloadInterval = $interval(function() {
            if( $scope.winner ) {
                //We'll let the team look at this as long as they want to.
                return true;
            }
            //With a little bit of work, this can be refactored into fetchGame
            if ($scope.usingServer) {
                gameService.current().then(function(game) {
                    if (game) {
                        //If the game hasn't changed, we'll leave things alone.
                        if (game.game_index === $scope.game.game_index) { 
                            return true;
                        } else {
                            $scope.game = game;
                            $scope.currentPlayer = _.findWhere($scope.players, {index: $scope.game.state});
                            $scope.setBoard();
                        }
                    } else {
                        //We'll do nothing and let the game continue in peace.
                    }
                });
                
                //A crazy thing we are doing here - multiple gates against this update. Without it, we have some ugly scope application issues. The downside is the small window for error, when a player isn't updating, a fetch is made, a player updates and stops, and then the fetch returns! It will glitch, but it will sort itself out. We need a test to prove this, but for now, it works to provide a nice feature at a low expense.
                if( !$scope.players[0].isUpdating && !$scope.players[1].isUpdating ) {
                    playerService.query().then(function(players) {
                        if( !$scope.players[0].isUpdating ) {
                            _.extend($scope.players[0], players[0]);
                        }
                        if( !$scope.players[1].isUpdating ) {
                            _.extend($scope.players[1], players[1]);
                        }
                    });
                }
            }
        }, $scope.specs.liveReloadSpeed);
    };


    //And off to the races...
    $scope.setPlayers();
    $scope.prepareGame();
    $scope.fetchGame();
    $scope.setLiveReload();

  });
