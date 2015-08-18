angular.module('socketio', [])
.factory('socketio', function ($rootScope) {
  var socket = io.connect("http://localhost:8000");
  
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        console.log('socketLogger: received: ', eventName);
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        console.log('socketLogger: emitted: ', eventName);
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
});