define(['lodash'], function(_) {
    function user() {
        this.depositAddresses = [];
        this.accountAmount = 0;
    }

    user.prototype.setDepositAddresses = function(depositAddresses) {
        this.depositAddresses = depositAddresses;
    }

    user.prototype.getDepositAddresses = function() {
        return this.depositAddresses;
    }


    user.prototype.setAccountAmount = function(amount) {
        this.accountAmount = amount;
    }

    user.prototype.getAccountAmount = function() {
        return this.accountAmount;
    }

    var instance = new user;
    return instance;
});