var unirest = require('unirest');

// var io = require('socket.io')(app);

var Game = require('../models/game/gameController');
var numberOfPlayers = 2;
var getQuestions = function(callback){
  unirest.get("http://jservice.io/api/random?count=10") // changed to 100
    .header("Accept", "application/json")
    .end(function (result) {
      var triviaArr = [];
      // var parsed = JSON.parse(result);
      // console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]',result.body);
      var collection = result.body;
      for(var i = 0; i < collection.length; i++){
        var trivia = {};
        trivia.id = collection[i].id;
        trivia.answer = collection[i].answer;
        trivia.question = collection[i].question;
        trivia.category = collection[i].category;
        trivia.value = collection[i].value;
        triviaArr.push(trivia);
    }
    callback(triviaArr);
  });
};

var makeGameObj = function() {
  var gameObj = {
    players: [],
    questions: null,
    maxNumQuestions: 10,
    questionNumber: -1,
    currQuest: function(){
      console.log(this.questionNumber);
      return this.questions[this.questionNumber];
    },
    prevQuest: function(){
      if (this.questionNumber === 0) {
        return null;
      } else {
        return this.questions[this.questionNumber - 1];
      }
    }
  };
  return gameObj;
};


module.exports = function(io){
  var setCountdown = function(gameTimer) {
    // reset timer
    if (gameTimer) {
      clearInterval(gameTimer);
    }
    // initialize timer number
    var counter = 30;
    gameTimer = setInterval(function() {
      io.emit('counter', {counter: counter});
      if (counter === 0) {
        clearInterval(gameTimer);
        var currQuest = gameObj.currQuest();
        currQuest.winner = "nobody :(";
        moveOnToNextQuestion();
      }
      counter--;
    }, 1000);
  };

  var gameObj = makeGameObj();
  var gameTimer;

    
    getQuestions(function(questions){
      for (var i = 0; i < questions.length; i++) {
        questions[i].playersAttempted = [];
      }
      gameObj.questions = questions;
    });

    var moveOnToNextQuestion = function() {
      gameObj.questionNumber++;
      if (gameObj.questionNumber === gameObj.maxNumQuestions) { // game over
        var winner;
        for(var i = 0; i < gameObj.players.length; i++){
          if (!winner){
            winner = gameObj.players[i];
          } else if (winner.score < gameObj.players[i].score){
            winner = gameObj.players[i];
          }
        }
        data = {winner: winner, message: winner.username+"wins!"};
        io.emit('endGame', data);
        Game.handleEndGame(gameObj);
      } else { // new question
        setCountdown(gameTimer);
        var q = gameObj.currQuest();
        io.emit('update', {
          players: gameObj.players,
          question: {question: q.question, category: q.category, value: q.value},
          prevQuest: gameObj.prevQuest(),
          questionNumber: gameObj.questionNumber + 1
        });
      }
    };
    var handleClientConnect = function(socket){
      
      socket.on('sending', function(){
      });
      
      socket.on('getUsername', function(data){
        if (gameObj.players.length < numberOfPlayers) {
          socket.username = data.username;
          gameObj.players.push({username: socket.username, score: 0});
          console.log(gameObj.players.length);
          if (gameObj.players.length === numberOfPlayers) {
            io.emit('startGame');
            moveOnToNextQuestion();
          }
        } else {
          // Game is already full
          socket.emit('fullGame');
          socket.on('fullGameReceived', function() {
            socket.disconnect(); // socket.close()?
          });
        }
      });

      socket.on('answer', function(input) {
        var answer = input.answer;
        var currQuest = gameObj.currQuest();
        var correctAnswer = currQuest.answer;
        var players = gameObj.players;

        if (currQuest.playersAttempted.indexOf(socket.username) > -1) {
          
        // Player already attempted this question, so s/he cannot answer anymore
          data = {error: "You can only attempt a question once!"};
          socket.emit('update', data);
          return;
        }

        // correct answer
        if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
          for (var i = 0; i < players; i++) {
            var player = players[i];
            if (player.username === socket.username){
              player.score += currQuest.value;
              currQuest.winner = socket.username;
              moveOnToNextQuestion();
              return;
            }          
          }
        } else { // wrong answer
          socket.emit('update', {error: "Wrong answer!"});
          currQuest.playersAttempted.push(socket.username);
          if (players.length === currQuest.playersAttempted.length) {
            currQuest.winner = "nobody :(";
            moveOnToNextQuestion();
          }
        }

      });

      socket.on('disconnect', function() {
        //numPlayers--;
      });

      socket.on('joinGame', function(){
        handleClientOnJoinGame(socket);
      });
      
    };

    var handleClientOnJoinGame = function(socket) {
      
      // Update everyone with the new player
      io.emit('update', {players: gameObj.players});
      
      // Start the game if there are 3 players
      if (gameObj.players.length === 3) {
        io.emit('startGame');
      }

      // A player answers


      // What to do if a player disconnects?
    };
    
    io.sockets.on('connect',handleClientConnect);
};