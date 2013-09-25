define(['lodash', 'jquery', 'require', 'mainPageController', 'transactionPageController'], function(_, $, require) {

    function router() {
        this.mappings = [];
        this.currentController = undefined;
    }

    router.prototype.run = function(callbackBeforeControllerInit, callbackAfterControllerInit) {
        var that = this;
        $(window).on('hashchange', function() {
            if (_.isFunction(callbackBeforeControllerInit)) {
                callbackBeforeControllerInit(location.hash.slice(1));
            }
            that.goTo(location.hash.slice(1));
            if (_.isFunction(callbackAfterControllerInit)) {
                callbackAfterControllerInit(location.hash.slice(1));
            }
        });
    }

    router.prototype.addMapping = function(name, controllerName) {
        this.mappings.push({
            'name': name,
            'controllerName': controllerName
        });
    }

    router.prototype.goTo = function(name) {
        var controller = _.find(this.mappings, { 'name': name });

        if (! _.isUndefined(controller)) {

            var controllerClass = require(controller.controllerName);
            if (!_.isUndefined(this.currentController)) {
                if (_.has(this.currentController, 'cleanAfter')) {
                    this.currentController.cleanAfter();
                }
            }
            this.currentController = new controllerClass;
            location.hash = '#' + name;
            this.currentController.handleRequest();
        }
    }

    var instance = new router();
    return instance;
});