module.exports = function(app){
  var httpServer = require('http').Server(app);
  var io = require('socket.io')(httpServer);


  // Things to keep track of
  var numPlayers = 0;
  var players = [{username: asdfasdf, score: asdfasdf}, etc.];
  var questionsAnswered = 0;
  var maxNumQuestions = 10;
  var prevQuestion = null;
  var currentQuestion = null; {question: aldkjfawlef, answer: laskjdflak, playersAttempted: [usernames]}

  var moveOnToNextQuestion = function() {
    if (questionsAnswered === maxNumQuestions) {
      data = {winner: winnerName, message: winnerName+"wins!"};
      io.emit('endGame', data);
    } else {
      // Reset currentQuestion
      // send new question to al players
    }
  };


  var handleClientOnConnection = function(socket) {
    // Update the number of players
    numPlayers++;
    players.push({username: asdfasdf, score: 0});

    // Update everyone with the new player
    io.emit('newPlayer', /*info about the new player */); // subject to change
    
    // Start the game if there are 3 players
    if (numPlayers === 3) {
      io.emit('startGame');
      // TODO: start the game for everyone
      // moveOnToNextQuestion()
    }

    // A player answers
    socket.on('answer', function(input) {
      /* TODO:
        - username = input.username, answer = input.answer
        - if (username is in currentQuestion.playersAttempted) {
            player already attempte this question, so s/he cannot answer anymore
            data = {error: "You can only attempt a question once"}
            socket.emit('update', data);
            return;
          }
        - correct answer:
          - questionsAnswered++;
          - update scores on the server side, send over new info to everyone
          - data = {
              question: someNewQuestion,
              prevQuestion: {question: lastQuestion, player: correctGuessersUsername}
            };
            io.emit('update', data);
            prevQuestion = currentQuestion
            move on to next question (this handles the case where all questions have been attempted)
        - wrong answer:
          - Add the player to currentQuestion.playersAttempted
          - if (numPlayers === currentQuestion.playersAttempted.length) {
              no one got this question right, so move on to the next question
            }
      */

    });

    // What to do if a player disconnects?
    socket.on('disconnect', function() {
      //numPlayers--;
    });
  };

  io.on('connection', handleClientOnConnection);

};