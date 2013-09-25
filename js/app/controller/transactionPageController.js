define(['serverGateway', 'lodash', 'user', 'transactionPageView', 'userAccountAmountView'], function(serverGateway, _, User, TransactionPageView, UserAccountAmountView) {
    function transactionPageController() {
        this.userAccountAmountView = new UserAccountAmountView;
        this.transactionPageView = new TransactionPageView(this);
    }

    transactionPageController.prototype.handleRequest = function() {
        var that = this;

        serverGateway.registerCallback("answer", function(answer) {
            console.log("Got answer: ");
            console.log(answer);

            if (_.isObject(answer) && _.has(answer, 'args') && _.has(answer.args, 'answerid')) {
                if(answer.args.answerid.indexOf('listTransactions') > -1) {
                    that.transactionPageView.renderTransactionsList(answer.args.data);
                }
            }
        });

        serverGateway.registerCallback("msg", function(msg) {
            console.log("Got message: ");
            var msgObject = JSON.parse(msg);
            that.transactionPageView.showMessage(msgObject.message);
        });

        serverGateway.registerCallback("objectsync", function(objectsyncJson) {
            var objectSync = JSON.parse(objectsyncJson);
            if (_.isObject(objectSync)) {
                _.forEach(objectSync, function(value, key) {
                    if (key == 'globalobject') {
                    } else if (key == 'user') {
                        handleUserObject(value);
                    } else if (key == 'minefield') {
                    } else {
                        console.log("Got objectsync: ") ;
                        console.log(objectSync);
                    }
                });
            }
        })

        that.transactionPageView.renderDepositList(User.getDepositAddresses());
        getTransactionsListFromServer();


        function getTransactionsListFromServer() {
            serverGateway.send(JSON.stringify({
                'object': 'user',
                'function': 'listTransactions',
                'answerid': 'listTransactions'+ new Date().getTime(),
                'arguments': [
                ]
            }));
        }

        function handleUserObject(object) {
            console.log("Got userobject: ");
            console.log(object);

            if (_.has(object, 'address_deposit')) {
                User.setDepositAddresses(object['address_deposit']);
                that.transactionPageView.renderDepositList(object['address_deposit']);
            }

            if (_.has(object, 'cash')) {
                that.user.setAccountAmount(object['cash']);
                that.userAccountAmountView.update(object['cash']);
            }
        }

        this.userAccountAmountView.update(User.getAccountAmount());
    }

    transactionPageController.prototype.generateDepositAddress = function() {
        serverGateway.send(JSON.stringify({
            'object': 'user',
            'function': 'generatedepositaddr',
            'answerid': 'generatedepositaddr'+ new Date().getTime(),
            'arguments': [
            ]
        }));
    }

    transactionPageController.prototype.withdrawMoney = function(money, address) {
        var convertedMoney = (parseFloat(money) * 100000000);

        serverGateway.send(JSON.stringify({
            'object': 'user',
            'function': 'sendMoney',
            'arguments': [
                address, convertedMoney
            ]
        }));
    }

    return transactionPageController;
});