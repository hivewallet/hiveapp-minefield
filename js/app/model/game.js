define(['lodash'], function(_) {

    var STATE = {
        NOT_STARTED: {value: 0, name: "Not started"},
        STARTED: {value: 1, name: "Started"},
        FINISHED_BY_USER: {value: 2, name: "Finished by user"}
    }

    function game() {
        this.state = STATE.NOT_STARTED;
    }

    game.prototype.startGame = function() {
        this.state = STATE.STARTED;
    }

    game.prototype.finishByApp = function() {
        this.state = STATE.NOT_STARTED;
    }

    game.prototype.finishByUser = function() {
        this.state = STATE.FINISHED_BY_USER;
    }

    game.prototype.isStarted = function() {
        return this.state == STATE.STARTED;
    }

    game.prototype.isFinishedByUser = function() {
        return this.state == STATE.FINISHED_BY_USER;
    }

    var instance = new game();
    return instance;
});