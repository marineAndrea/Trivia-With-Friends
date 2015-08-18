(function() {

  var app = angular.module('User',['socketio']);


  app.factory('UserFactory', ['$http', '$location', '$window', 'socketio', function($http, $location, $window, socketio) {

    var obj = {}; // export object so you can later add new objects and methods to our factories

    obj.signin = function (user) {
      return $http.post('/api/users/signin', {
        username: user.username,
        password: user.password
      })
      .then(function (resp) {
        return resp.data.token;
      });
    };

    obj.signup = function (user) {
      return $http.post('/api/users/signup', {
        username: user.username,
        password: user.password
      })
      .then(function (resp) {
        return resp.data.token;
      });
    };

    obj.isAuth = function () {
      return !!$window.localStorage.getItem('com.TriviaWithFriends');
    };

    obj.signout = function () {
      socketio.disconnect();
      obj.currentUser = null;
      $window.localStorage.removeItem('com.TriviaWithFriends');
      $window.localStorage.removeItem('com.TriviaWithFriends.username');
      $location.path('/signin');
    };

    return obj;
  }]);

  app.controller('UserController', ['$scope', '$window', '$location', 'UserFactory', function($scope, $window, $location, UserFactory) {
    $scope.test = 'test';
    $scope.user = {};
    $scope.signin = function () {
      UserFactory.signin($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.TriviaWithFriends', token);
          $window.localStorage.setItem('com.TriviaWithFriends.username', $scope.user.username);
         $location.path('/profile');
       })
       .catch(function (error) {
          console.error(error);
        });
    };

    $scope.signup = function () {
      UserFactory.signup($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.TriviaWithFriends', token);
          $window.localStorage.setItem('com.TriviaWithFriends.username', $scope.user.username);
          $location.path('/profile');
        })
        .catch(function (error) {
          console.error(error);
        });
    };

  }]);

})();
