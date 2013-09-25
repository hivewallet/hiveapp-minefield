require.config({
    paths: {
        'jquery': 'lib/jquery',
        'socket': 'lib/socket.io',
        'lodash': 'lib/lodash.min',
        'serverGateway': 'app/serverGateway',
        'userCountView': 'app/view/userCountView',
        'userAccountAmountView': 'app/view/userAccountAmountView',
        'multipierView': 'app/view/multipierView',
        'minefieldView': 'app/view/minefieldView',
        'minesView': 'app/view/minesView',
        'user': 'app/model/user',
        'minefield': 'app/model/minefield',
        'game': 'app/model/game',
        'mainPageController': 'app/controller/mainPageController',
        'transactionPageController': 'app/controller/transactionPageController',
        'authenticationService': 'app/service/authenticationService',
        'router': 'app/router',
        'templateEngine': 'app/templateEngine',
        'transactionPageView': 'app/view/transactionPageView'
    }
});

require(['jquery', 'socket', 'lodash',  'router', 'templateEngine', 'serverGateway'], function($, socket, _,  router, templateEngine, serverGateway) {
    router.addMapping('mainPage', 'mainPageController');
    router.addMapping('transactionPage', 'transactionPageController');

    templateEngine.setRoot('#app-content');
    templateEngine.addTemplate('mainPage', '#main-page-template');
    templateEngine.addTemplate('transactionPage', '#transaction-page-template');

    router.run(
        function(name) {
            serverGateway.cleanState();
            templateEngine.render(name);
        }
    );

    templateEngine.render('mainPage');
    router.goTo('mainPage');
});