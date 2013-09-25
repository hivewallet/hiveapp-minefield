define(['lodash', 'jquery'], function(_, $) {
    function userCountView() {}

    userCountView.prototype.update = function(userCount) {
        $('#online-users-count').html(userCount);
    }

    return userCountView;
});