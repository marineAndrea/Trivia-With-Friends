angular.module('socketio', [])

.factory('socketio', function ($rootScope, $window ) {

  var originUrl = window.location.origin;
  // var port = location.port;
  // var connectURL = originUrl + ":" + port;
  var socket = io.connect(originUrl);
  
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
    }
  };
});