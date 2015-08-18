(function() {

  var app = angular.module('Trivia', ['Profile']);

  //factory to get and hold question data
  //also has methods for cleaning and augmenting question data
  app.factory('Questions', ['$http', function($http) {
    var obj = {};

    obj.getQuestions = function() { // retrieves questions from backend
      return $http.get('/api/trivia').success(function(data) {
        // using Angular $http service to query our questions route
        // success cb executes when request returns
        // route returns a list of questions
        obj.questions = data;
      });
    };

    obj.updateUser = function(user){
      return $http.put('/api/users', {
        username: user.username,
        score: user.score,
        correct: user.correct,
        correctStreak: user.correctStreak,
        answered: user.answered
      });
    };

    return obj;
  }]);


  app.controller('TriviaController', ['$scope', '$http', 'Questions', '$interval', '$location', 'ProfileFactory', function($scope, $http, Questions, $interval, $location, ProfileFactory) {

    //sample trivia api response for chai test
    $scope.player = {};
    $scope.opponents = [];
    $scope.q = {};
    $scope.prevQ = {};
    $scope.gameOn = false;
    $scope.updateUser = Questions.updateUser;
    $scope.username = ProfileFactory.getUsername();

    // initialize game data
    $scope.gameDataInit = function() {
      $scope.answered = 0;
      $scope.correct = 0;
      $scope.correctStreak = 0;
      $scope.currentStreak = 0;
      $scope.score = 0;
    };

    //for question navigation
    $scope.navLoc = 0;
    $scope.nextLoc = function() {
      $scope.navLoc++;
      $scope.setCountdown();
      if ($scope.navLoc === 10) {
        $scope.updateUser({
          username: $scope.username,
          score: $scope.score,
          correct: $scope.correct,
          correctStreak: $scope.correctStreak,
          answered: $scope.answered

        });
        $location.path("/trivia/endgame"); // render endgame view
      }
    };

    socket.on('update', function(data){
      for (var key in data) {
        
        if (key === 'question') {
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
          }
        } else {
          $scope[key] = data[key];
        }
      }
    });

    socket.on('startGame', function(){
      $scope.gameOn = true;  
      gameDataInit();
    });

    socket.on('endGame', function(){
      console.log('game over, man. game over');
    });

    var joinGame = function() {
      socket.connect('http://localhost:8000');
    };

    //for handling user answers to trivia
   $scope.checkAnswer = function(keyEvent, question) {
      if(keyEvent.keyCode === 13) {
        $scope.answered++;
        var id = question.id;
        var value = question.value;
        var userAns = question.userAnswer;
        
        socket.emit('answer', {data: userAns});


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



    //Timer uses timeout function
    //cancels a task associated with the promise
    $scope.setCountdown = function() {
      //resets the timer
      if(angular.isDefined($scope.gameTimer)) {
        $interval.cancel($scope.gameTimer);
        $scope.gameTimer = undefined;
      }
      //initialize timer number
      $scope.counter = 30;
      //countdown
      $scope.gameTimer = $interval(function() {
        $scope.counter--;
        if($scope.counter === 0) {
          socket.emit('answer', {'answer': ""});
          // $scope.nextLoc();
          // $scope.setCountdown();
        }
      }, 1000);
    };
    //cancel timer if user navigates away from questions
    $scope.$on('$destroy', function() {
      $interval.cancel($scope.gameTimer);
    });

  }]);

})();
