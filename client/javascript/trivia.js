(function() {

  var app = angular.module('Trivia', ['Profile']);

  app.controller('TriviaController', ['$scope', '$http', 'Questions', '$interval', '$location', 'ProfileFactory', function($scope, $http, Questions, $interval, $location, ProfileFactory) {

    //sample trivia api response for chai test
    $scope.player = {};
    $scope.opponents = [];
    $scope.q = {};
    $scope.prevQ = {};
    $scope.gameOn = false;
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

    socket.on('update', function(data){
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

    socket.on('connect', function(){
      socket.emit('getUsername', {
        username: $window.localStorage.removeItem('com.TriviaWithFriends.username')
      });
    });
    
    socket.on('startGame', function(){

      $scope.gameOn = true;  
      gameDataInit();
    });

    socket.on('endGame', function(data){
      $scope.winner = data.winner;
      console.log('game over, man. game over');
      socket.disconnect(); // socket.close()?
      $location.path("/trivia/endgame");
    });

    var joinGame = function() {
      socket.connect('http://localhost:8000');
    };

    socket.on('fullGame', function() {
      $scope.fullGameError = true;
      socket.emit('fullGameReceived');
    });

    socket.on('counter', function(data) {
      $scope.counter = data.counter;
    });


    // TO DO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //for handling user answers to trivia
   $scope.checkAnswer = function(keyEvent, question) {
      if(keyEvent.keyCode === 13) {
        $scope.answered++;
        
        var input = {
          answer: question.userAnswer,
        };

        socket.emit('answer', input);


        // return $http.post('/api/trivia', {
        //   id: id,
        //   value: value,
        //   userAns: userAns
        // }).then(function (res) {
        //   var q = res.data;
        //   if(q.correct){
        //     $scope.correct++;
        //     $scope.currentStreak++;
        //     $scope.score += value;
        //   }else{
        //     $scope.currentStreak = 0;
        //   }
        //   if($scope.currentStreak > $scope.correctStreak){
        //     $scope.correctStreak = $scope.currentStreak;
        //   }
        //   $scope.nextLoc();
        // });
      }
    };

    // disconect socket if user navigates away from questions
    $scope.$on('$destroy', function() {
      socket.disconnect();
    });

  }]);

})();
