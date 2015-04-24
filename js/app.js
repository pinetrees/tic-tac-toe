app = angular.module('TicTacToe', [
            'angular-underscore'
        ]);
app.controller('MainCtrl', function ($scope) {
    $scope.player = 1;
    $scope.status = 1;
    $scope.specs = {
        'length' : 3
    }
    $scope.board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]

    $scope.crossSections = function() {
        return [
            [$scope.board[0][0], $scope.board[1][1], $scope.board[2][2]],
            [$scope.board[0][2], $scope.board[1][1], $scope.board[2][0]]
        ]
    }

    $scope.setCrossSections = function() {
        $scope.cross_sections = $scope.crossSections();
    }

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

    $scope.declareWinner = function(player_index) {
        $scope.winner = 'Player ' + player_index
        $scope.status = 0;
        return true;
    }

    $scope.checkTuple = function(tuple, player_index) {
        won = _.every(tuple, function(cell) {
            return cell == player_index;
        }) 

        if ( won ) $scope.declareWinner(player_index);
    }


    $scope.checkGame = function() {
        //There are three ways to win this game:
        //  1. Have a mark in every cell for a given row
        //  2. Have a mark in every cell for a given column
        //  3. For all i between 1 and n, with n the length of the matrix, have a mark in cell (i, i)

        //We'll start by looking through the rows
        for ( i = 0; i < $scope.specs.length; i++ ) {
            
            //We may have a winner. If this is the case, we'll break out
            if ( $scope.winner ) break;

            //We'll start by taking the first row
            row = $scope.board[i];

            //I'm mixing in underscore, because it's going to stop checking once it fails. I'm going to mimick the same process
            player_one_wins = $scope.checkTuple(row, 1);

            //If player one doesn't have all the cells in this row, we'll check the same for player 2
            player_two_wins = $scope.checkTuple(row, 2);

            //No one has won yet. Before we move to the next row, we'll check the associated column
            col = _.map($scope.board, function(row) { return row[i]; });

            player_one_wins = $scope.checkTuple(col, 1);

            player_two_wins = $scope.checkTuple(col, 2);

        }

        //If we don't have a winner yet, we still need to check the two cross sections
        $scope.setCrossSections();

        player_one_wins = $scope.checkTuple($scope.cross_sections[0], 1);

        player_two_wins = $scope.checkTuple($scope.cross_sections[0], 2);

        player_one_wins = $scope.checkTuple($scope.cross_sections[1], 1);

        player_two_wins = $scope.checkTuple($scope.cross_sections[1], 2);

    }
});
