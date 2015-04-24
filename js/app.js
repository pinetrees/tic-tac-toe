app = angular.module('TicTacToe', [
            'angular-underscore'
        ]);
app.controller('MainCtrl', function ($scope) {
    $scope.player = 1;
    $scope.specs = {
        'length' : 3
    }
    $scope.board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    ]
    $scope.move = function(row, col) {
        if($scope.board[row][col] == 0) {
            $scope.board[row][col] = $scope.player;
            $scope.checkGame()
            $scope.changePlayer()
        }
    }

    $scope.changePlayer = function() {
        if ($scope.player == 1) {
            $scope.player = 2;
        } else {
            $scope.player = 1;
        }
    }

    $scope.checkTuple = function(tuple, player_index) {
        return _.every(tuple, function(cell) {
            return cell == player_index;
        }) 
    }

    $scope.declareWinner = function(player_index) {
        $scope.winner = 'Player ' + player_index
        $scope.status = 0;
        return true;
    }


    $scope.checkGame = function() {
        //There are three ways to win this game:
        //  1. Have a mark in every cell for a given row
        //  2. Have a mark in every cell for a given column
        //  3. For all i between 1 and n, with n the length of the matrix, have a mark in cell (i, i)
        //Check the rows first
        _.each( $scope.board, function(row) {

            player_one_wins = $scope.checkTuple(row, 1);

            if ( player_one_wins ) return $scope.declareWinner(1);  

            player_two_wins = $scope.checkTuple(row, 2);

            if ( player_two_wins ) return $scope.declareWinner(2);  

        } );

        for ( i = 0; i < $scope.specs.length; i++ ) {

            row = $scope.board[i];

            //I'm mixing in underscore, because it's going to stop checking once it fails. I'm going to mimick the same process
            player_one_wins = $scope.checkTuple(row, 1);

            if ( player_one_wins ) return $scope.declareWinner(1); 

            //If player one doesn't have all the cells in this row, we'll check the same for player 2
            player_two_wins = $scope.checkTuple(row, 2);

            if ( player_two_wins ) return $scope.declareWinner(2);  

            //No one has won yet. Before we move to the next row, we'll check the associated column
            col = _.map($scope.board, function(row) { return row[i]; });
            console.log(col);

        }
    }
});
