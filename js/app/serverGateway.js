define(['socket', 'lodash'], function(socket, _) {

    function ServerGateway() {
        this.connection = socket.connect("minefield.bitcoinlab.org:45284");
        this.callbacks = {}
    }

    ServerGateway.prototype.connect = function(uid, secret) {
        this.connection.emit("hello", {
            uid: uid,
            secret: secret
        });
    };

    ServerGateway.prototype.send = function(params) {
        this.connection.emit("call", params);
    }

    ServerGateway.prototype.newUser = function(authCallback) {
        this.connection.once("newuser", authCallback);
        this.connection.emit("newuser");
    }

    ServerGateway.prototype.cleanState = function() {
        this.connection.removeAllListeners();
    }

    ServerGateway.prototype.registerCallback = function(eventName, callback) {
        if (_.has(this.callbacks, eventName)) {
            this.callbacks[eventName].push(callback);
        } else {
            this.callbacks[eventName] = [callback];
        }
        console.log('register callback: ' + eventName);
        this.connection.on(eventName, callback);
    }

    var instance = new ServerGateway();

    return instance;

});