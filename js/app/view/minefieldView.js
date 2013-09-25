define(['lodash', 'jquery'], function(_, $) {

    var FIELD_ROWS = 5;
    var FIELD_COLUMNS = 5;

    function getColumnFromIndex(index) {
        return index % FIELD_COLUMNS;
    }

    function getRowFromIndex(index) {
        return Math.floor(index / FIELD_ROWS);
    }

    function getIndexFromColumnRow(column, row) {
        return row * FIELD_ROWS + column;
    }

    function minefieldView(controller) {
        this.controller = controller;
        this.enableStartGameButton();
        this.disableFinishGameButton();
    }

    minefieldView.prototype.disableStartGameButton = function() {
        $('#start-game-button').hide();
        $('#start-game-button').unbind('click');
    }

    minefieldView.prototype.enableStartGameButton = function() {
        var that = this;
        $('#start-game-button').show();
        $('#start-game-button').bind('click', function() {
            that.controller.startGameAction();
            setEventHandlersToFields();
        });
        function setEventHandlersToFields() {
            $('#game-field td').each(function(index, element) {
                $(element).bind('click', function() {
                    $(element).unbind('click');
                    that.controller.sendMove(getColumnFromIndex(index), getRowFromIndex(index));
                });
            });
        }
    }

    minefieldView.prototype.enableFinishGameButton = function() {
        var that = this;
        $("#finish-game-button").bind('click', function(){
            that.controller.finishGameByUser();
        });
        $('#finish-game-button').show();
    }

    minefieldView.prototype.disableFinishGameButton = function() {
        $('#finish-game-button').unbind('click');
        $('#finish-game-button').hide();
    }

    minefieldView.prototype.cleanState = function() {
        $('#game-field td').each(function() {
            $(this).unbind('click');
        });
    }

    minefieldView.prototype.setAllFieldsUncovered = function() {
        $('#game-field td').each(function() {
            $(this).css("background", "url('img/nienajechana_trawa.gif')");
        });
    }

    minefieldView.prototype.setFieldAsSelected = function(column, row) {
        $('#game-field td').each(function(index) {
            if (getIndexFromColumnRow(column, row) == index) {
                $(this).css("background", "url('img/kliknieta_ziemia.gif')");
            }
        });
    }

    minefieldView.prototype.setFieldAsBomb = function(column, row) {
        $('#game-field td').each(function(index) {
            if (getIndexFromColumnRow(column, row) == index) {
                $(this).css("background", "url('img/kliknieta_mina.gif')");
            }
        });
    }

    minefieldView.prototype.setFieldAsBombAfterGameEnd = function(column, row) {
        $('#game-field td').each(function(index) {
            if (getIndexFromColumnRow(column, row) == index) {
                $(this).css("background", "url('img/wyswietlona_mina.gif')");
            }
        });
    }

    minefieldView.prototype.setFieldAsCoveredAfterGameEnd = function(column, row) {
        $('#game-field td').each(function(index) {
            if (getIndexFromColumnRow(column, row) == index) {
                $(this).css("background", "url('img/niekliknieta_ziemia.gif')");
            }
        });
    }


    minefieldView.prototype.showMessage = function(msg) {
        alert(msg);
    }

    return minefieldView;

});