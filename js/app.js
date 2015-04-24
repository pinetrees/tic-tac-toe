app = angular.module('TicTacToe', [
            'angular-underscore'
        ]);
app.controller('MainCtrl', function ($scope) {
    $scope.player = 1;
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

    $scope.checkGame = function() {
        //_.each( $scope.board, function(row) {
        //    console.log(row);
        //} );
    }
});
