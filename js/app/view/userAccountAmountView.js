define(['lodash', 'jquery'], function(_, $) {
    function userAccountAmountView() {}

    userAccountAmountView.prototype.update = function(newAmount) {
        $('#user-account-amount').html(newAmount);
    }

    return userAccountAmountView;

});