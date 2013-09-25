define(['lodash'], function(_) {

    var STATE = {
        EMPTY: {value: 0, name: "Empty"},
        SELECTED: {value: 1, name: "Selected"},
        BOMB: {value: 2, name: "Bomb"}
    };

    function minefield(columns, rows) {
        this.columns = columns;
        this.rows = rows;
        this.board = new Array(columns);

        var that = this;

        _.times(columns, function(columnIndex){
            that.board[columnIndex] = new Array(rows);
        });
    }

    minefield.prototype.cleanState = function() {
        var that = this;
        _.times(that.columns, function(columnIndex) {
            _.times(that.rows, function(rowIndex){
                that.board[columnIndex][rowIndex] = STATE.EMPTY;
            });
        });
    }

    minefield.prototype.setFieldAsSelected = function(column, row) {
        this.board[column][row] = STATE.SELECTED;
    }

    minefield.prototype.setFieldAsBomb = function(column, row) {
        this.board[column][row] = STATE.BOMB
    }

    return minefield;
});