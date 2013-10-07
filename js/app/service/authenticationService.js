define(['serverGateway', 'lodash'], function(serverGateway, _) {
    function authenticationService() {}

    authenticationService.prototype.authenticate = function() {
        if (_.isNull(localStorage.getItem('auth_data_uid')) || _.isNull(localStorage.getItem('auth_data_secret'))) {
            serverGateway.newUser(function(object) {
                localStorage.setItem('auth_data_uid', object.id);
                localStorage.setItem('auth_data_secret', object.secret);
                serverGateway.connect(object.id, object.secret);
            });
        } else {
            serverGateway.connect(localStorage.getItem('auth_data_uid'), localStorage.getItem('auth_data_secret'));
        }
    }

    return authenticationService;
});