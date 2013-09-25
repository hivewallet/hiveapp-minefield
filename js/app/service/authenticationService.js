define(['serverGateway', 'lodash'], function(serverGateway, _) {
    function authenticationService() {}

    authenticationService.prototype.authenticate = function() {
        console.log(sessionStorage);
        if (_.isNull(sessionStorage.getItem('auth_data_uid')) || _.isNull(sessionStorage.getItem('auth_data_secret'))) {
            serverGateway.newUser(function(object) {
                sessionStorage.setItem('auth_data_uid', object.id);
                sessionStorage.setItem('auth_data_secret', object.secret);
                serverGateway.connect(object.id, object.secret);
            });
        } else {
            serverGateway.connect(sessionStorage.getItem('auth_data_uid'), sessionStorage.getItem('auth_data_secret'));
        }
    }

    return authenticationService;
});