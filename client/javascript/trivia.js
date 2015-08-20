(function() {

  var app = angular.module('Trivia', ['Profile']);

  app.controller('TriviaController', ['$scope', '$window', '$http', '$interval', '$location', 'ProfileFactory', 'socketio',function($scope, $window, $http, $interval, $location, ProfileFactory, socketio) {

    //sample trivia api response for chai test
    $scope.player = {};
    $scope.opponents = [];
    $scope.q = {};
    $scope.prevQ = {};
    $scope.gameOn = false;
    $scope.waiting = false;
    $scope.username = ProfileFactory.getUsername();

    // initialize game data
    //$scope.gameDataInit = function() {
    var gameDataInit = function() {
      $scope.answered = 0;
      $scope.correct = 0;
      $scope.correctStreak = 0;
      $scope.currentStreak = 0;
      $scope.score = 0;
    };

    socketio.on('testing', function(){
      console.log('received testing');
      socketio.emit('sending', {data: 'hello'});
    });


    socketio.on('update', function(data){
      for (var key in data) {
        
        if (key === 'question') {
          $scope.error = null; // clear any error messages for a new question
          setCountdown(); 
        }

        if(key === 'players'){
          for(var i = 0; i < data[key]; i++) {
            var player = data[key][i];
            var thisUsername = $window.localStorage.getItem('com.TriviaWithFriends.username');
            if (player.name === thisUsername ) {
              $scope.player = player;
            } else {
              $scope.opponents.push(player);
            }
          }        } else {
          $scope[key] = data[key];
        }
      }
    });
    
    socketio.on('startGame', function(){
      $scope.waiting = false;
      $scope.gameOn = true;  
      gameDataInit();
    });

    socketio.on('endGame', function(data){
      $scope.winner = data.winner;
      console.log('game over, man. game over');
      socketio.disconnect(); // socketio.close()?
      $location.path("/trivia/endgame");
    });

    $scope.joinGame = function() {
      socketio.emit('hello');
      socketio.socket.emit('getUsername', {
        username: $window.localStorage.removeItem('com.TriviaWithFriends.username')
      });
      $scope.waiting = true;
    };

    socketio.on('fullGame', function() {
      $scope.fullGameError = true;
      socketio.emit('fullGameReceived');
    });

    socketio.on('counter', function(data) {
      $scope.counter = data.counter;
    });

    var joinGame = $scope.joinGame;

    // TO DO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //for handling user answers to trivia
   $scope.checkAnswer = function(keyEvent, question) {
      if(keyEvent.keyCode === 13) {
        $scope.answered++;
        
        var input = {
          answer: question.userAnswer,
        };

        socketio.emit('answer', input);
      }
    };

    // disconect socket if user navigates away from questions
    $scope.$on('$destroy', function() {
      socketio.disconnect();
    });

  }]);

})();
