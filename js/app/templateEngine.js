define(['lodash', 'jquery'], function(_, $) {
    function templateEngine() {
        this.templates = []
        this.root = document.body;
    }

    templateEngine.prototype.setRoot = function(rootElement) {
        this.root = rootElement;
    }

    templateEngine.prototype.addTemplate = function(name, elementId) {
        this.templates.push({
            'name': name,
            'elementId': elementId
        })
    }

    templateEngine.prototype.render = function(name) {
        var template = _.find(this.templates, { 'name': name });

        if (! _.isUndefined(template)) {
            console.log('load template: ' + template.elementId);
            var templateCode = $(template.elementId).html();
            $(this.root).html(templateCode);
        }
    }

    var instance = new templateEngine();
    return instance;
});