define(['lodash', 'serverGateway', 'userCountView', 'multipierView', 'user', 'userAccountAmountView', 'minefieldView', 'minefield', 'minesView', 'authenticationService', 'game', 'bootbox'],
    function(_, ServerGateway, UserCountView, MultipierView, User, UserAccountAmountView, MinefieldView, MinefieldModel, MinesView, AuthenticationService, Game, bootbox) {
    function MainPageController() {
        this.userCountView = new UserCountView();
        this.multipierView = new MultipierView();
        this.user = User;
        this.userAccountAmountView = new UserAccountAmountView();
        this.minefieldView = new MinefieldView(this);
        this.minefieldModel = new MinefieldModel(5,5);
        this.minesView = new MinesView(this);
        this.authenticationService = new AuthenticationService();
    }

    MainPageController.prototype.startGameAction = function() {
        console.log("Game started");
        Game.startGame();

        var numberOfMines = parseFloat(this.minesView.getSelectedMinesNumber());
        var bet = parseFloat(this.multipierView.getBet());

        if (bet <= this.user.getAccountAmount()) {
            this.serverGateway.send(JSON.stringify({
                   'object': 'user',
                   'function': 'newminefield',
                   'arguments': [numberOfMines, bet]
            }));

            this.minefieldView.enableFinishGameButton();
            this.minefieldView.disableStartGameButton();
            this.minefieldView.setAllFieldsUncovered();
            this.minefieldModel.cleanState();
            this.minesView.disableMinesSelect();
            this.multipierView.disable();
        } else {
            this.minefieldView.showMessage('Your bet is greater than your cash amount. Please deposit or change your bet.');
        }
    }

    MainPageController.prototype.finishGameAction = function() {
        this.minefieldView.enableStartGameButton();
        this.minefieldView.disableFinishGameButton();
        this.multipierView.enable();
        this.minesView.enableMinesSelect();
        this.minefieldView.cleanState();
        this.minefieldModel.cleanState();
        this.updateMinesMultiplier();
        if (Game.isFinishedByUser()) {
            this.minefieldView.showMessage("You won!");
        } else {
            this.minefieldView.showMessage("Sorry, you lost!");
        }
        Game.finishByApp();
    }

    MainPageController.prototype.finishGameByUser = function() {
        Game.finishByUser();
        this.serverGateway.send(JSON.stringify({
            'object': 'minefield',
            'function': 'payout',
            'arguments': []
        }));
    }

    MainPageController.prototype.sendMove = function(column, row) {
            this.serverGateway.send(JSON.stringify({
                'object': 'minefield',
                'function': 'step',
                'arguments': [
                    [row, column]
                ]
            }));
    }

    MainPageController.prototype.updateMinesMultiplier = function(multi) {
        if (_.isUndefined(multi)) {
            var E = 100 - (this.minesView.getSelectedMinesNumber() / (25 / 100));
            var H = (90 / E);
            H = Math.round(H * 100) / 100;
            this.minesView.updateMultiplierValue(H);
        } else {
            this.minesView.updateMultiplierValue(multi);
        }
    }

    MainPageController.prototype.initViews = function() {
        this.userCountView.update(Game.getUserCount());
        this.userAccountAmountView.update(this.user.getAccountAmount());
        this.multipierView.update(Game.getAvailableBets(), this.user.getAccountAmount());
    }

    MainPageController.prototype.handleRequest = function() {
        var that = this;

        this.serverGateway = ServerGateway;
        this.authenticationService.authenticate();

        this.initViews();


        this.serverGateway.registerCallback("objectsync", function(objectsyncJson) {
            var objectSync = JSON.parse(objectsyncJson);

            if (_.isObject(objectSync)) {
                _.forEach(objectSync, function(value, key) {
                    if (key == 'globalobject') {
                        handleGlobalObject(value);
                    } else if (key == 'user') {
                        handleUserObject(value);
                    } else if (key == 'minefield') {
                        handleMinefieldObject(value);
                    } else {
                        console.log("Got objectsync: ") ;
                        console.log(objectSync);
                    }
                });
            }
        });

        this.minesView.render(3,24);

        function handleMinefieldObject(object) {
            if (_.isObject(object)) {
                if (_.has(object, 'minefield') && _.isArray(object['minefield'])) {
                    var rowIndex = 0;
                    var columnIndex = 0;

                    _.each(object['minefield'], function(column) {
                        rowIndex = 0;
                        _.each(column, function() {
                            if (column[rowIndex] == "2") {
                                that.minefieldView.setFieldAsSelected(rowIndex, columnIndex);
                                that.minefieldModel.setFieldAsSelected(rowIndex, columnIndex);
                            } else if (column[rowIndex] == "3") {
                                that.minefieldView.setFieldAsBomb(rowIndex, columnIndex);
                                that.minefieldModel.setFieldAsBomb(rowIndex, columnIndex);
                            } else if (column[rowIndex] == "1") {
                                that.minefieldView.setFieldAsBombAfterGameEnd(rowIndex, columnIndex);
                                that.minefieldModel.setFieldAsBomb(rowIndex, columnIndex);
                            } else if (column[rowIndex] == "0") {
                                that.minefieldView.setFieldAsCoveredAfterGameEnd(rowIndex, columnIndex);
                            }
                            ++rowIndex;
                        });
                        ++columnIndex;
                    });
                } else if (_.has(object, 'multi')) {
                    that.updateMinesMultiplier(object.multi);

                } else if (_.has(object, 'done')) {
                    that.finishGameAction();
                }
            }
        }

        function handleUserObject(value) {
            if (_.isObject(value)) {
                console.log(value);

                if (_.has(value, 'cash')) {
                    var transformedMoney = value['cash'] / 100000000;
                    that.user.setAccountAmount(transformedMoney);
                    that.userAccountAmountView.update(transformedMoney);
                }
                if (_.has(value, 'address_deposit')) {
                    that.user.setDepositAddresses(value['address_deposit']);
                }
            }
        }

        function handleGlobalObject(value) {
            if (_.isObject(value)) {
                console.log("Got globalobject: ");
                console.log(value);

                if (_.has(value, 'users')) {
                    that.userCountView.update(value['users']);
                    Game.setUserCount(value['users']);
                }

                if (_.has(value, 'availiablebets')) {
                    that.multipierView.update(value['availiablebets'], that.user.getAccountAmount());
                    Game.setAvailableBets(value['availiablebets'])
                }
            }
        }
    }

    MainPageController.prototype.cleanAfter = function() {
        Game.finishByApp();
    }

    return MainPageController;
});