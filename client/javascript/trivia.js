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
      socketio.emit('sending', {data: 'hello'});
    });


    socketio.on('update', function(data){

      for (var key in data) {
        
        if (key === 'question') { // new question received
          $scope.q.userAnswer = "";
          $scope.question = data.question;
          $scope.error = null; // clear any error messages for a new question
        } else if(key === 'players') {
          var players = data[key];
          $scope.opponents = [];
          for(var i = 0; i < players.length; i++) {
            var player = players[i];
            var thisUsername = $scope.username;
            if (player.username === thisUsername ) {
              $scope.player = player;
            } else {
              $scope.opponents.push(player);
            }
          } 
        } else {
          $scope[key] = data[key];
        }
      }
    });
    
    socketio.on('startGame', function(data){
      $scope.waiting = false;
      $scope.gameOn = true;
      $scope.numberOfQuestions = data.numberOfQuestions;  
      gameDataInit();
    });

    
    socketio.on('endGame', function(data){
      $scope.winner = data.winner;
      // $scope.player.score = data.score;
      // $scope.opponent = data.opponents;
      console.log('game over, man. game over');
      // debugger;
      $location.path("/trivia/endgame");
      // socketio.disconnect(); // socketio.close()?
    });

    $scope.joinGame = function() {      
      socketio.emit('joinGame');
      socketio.emit('getUsername', {
        username: $scope.username
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

      // socketio.disconnect();
    });

  }]);

})();
