angular.module('socketio', [])

.factory('socketio', function ($rootScope, $window ) {

  var socket = io.connect("http://localhost:3000");
  
  return {
    socket: socket,
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        console.log('socketLogger: received: ', eventName);
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },

    emit: function (eventName, data) {
      socket.emit(eventName, data)
    }
  };
});