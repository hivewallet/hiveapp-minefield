define(['socket', 'lodash'], function(socket, _) {

    function ServerGateway() {
        console.log("Create connection with minefield server.")
        this.connection = socket.connect("minefield.bitcoinlab.org:45284");
        this.callbacks = {};
        this.isConnected = false;
    }

    ServerGateway.prototype.connect = function(uid, secret) {
        if (! this.isConnected) {
            this.connection.emit("hello", {
                uid: uid,
                secret: secret
            });
            this.isConnected = true;
        }
    };

    ServerGateway.prototype.send = function(params) {
        this.connection.emit("call", params);
    }

    ServerGateway.prototype.newUser = function(authCallback) {
        this.connection.once("newuser", authCallback);
        this.connection.emit("newuser");
    }

    ServerGateway.prototype.cleanState = function() {
        console.log('Remove all callbacks.');
        this.callbacks = {};
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
        console.log(this.connection);
    }

    var instance = new ServerGateway();

    return instance;

});