define(['lodash'], function(_) {

    var STATE = {
        NOT_STARTED: {value: 0, name: "Not started"},
        STARTED: {value: 1, name: "Started"},
        FINISHED_BY_USER: {value: 2, name: "Finished by user"}
    }

    function game() {
        this.state = STATE.NOT_STARTED;
        this.userCount = 0;
        this.availableBets = [0];
    }

    game.prototype.setAvailableBets = function(availableBets) {
        this.availableBets = availableBets;
    }

    game.prototype.getAvailableBets = function() {
        return this.availableBets;
    }

    game.prototype.setUserCount = function(userCount) {
        this.userCount = userCount;
    }

    game.prototype.getUserCount = function() {
        return this.userCount;
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