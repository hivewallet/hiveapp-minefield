define(['lodash', 'jquery'], function(_, $) {

    function transactionPageView(controller) {
        this.controller = controller;

        $('#generate-deposit-button').bind('click', function() {
            controller.generateDepositAddress();
        });

        $('#withdrawal-button').bind('click', function() {
            var money = $('#money-withdrawal').val();
            var address = $('#address-withdrawal').val();

            controller.withdrawMoney(money, address);
        });
    }

    transactionPageView.prototype.renderDepositList = function(depositList) {
        generateListAsHtml(depositList, '#deposit-list-box');
    }

    transactionPageView.prototype.renderTransactionsList = function(transactionList) {
        generateListAsHtml(transactionList, '#transaction-list-box', function(object) {
            return object.address + ", " + object.category + ", " + (object.amount / 100000000);
        });

    }

    function generateListAsHtml(list, element, render) {
        if (_.isArray(list)) {
            $(element).html('');
            _.each(list, function(value) {
                var li = $('<li>');
                if (_.isFunction(render)) {
                    li.html(render(value));
                } else {
                    li.html(value);
                }

                $(element).append(li);
            });
        }
    }

    transactionPageView.prototype.showMessage = function(message) {
        alert(message);
    }

    return transactionPageView;
});