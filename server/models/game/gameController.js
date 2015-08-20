var Game = require('./gameModel.js');
var User = require('../users/userModel');

module.exports = {
    handleEndGame: function(gameObj) {
      var newGame = new Game({players: gameObj.players});
      newGame.save(function(err, game) {
        if (err) {
          console.log('error posting user', error);
        } else {
          for (var i = 0; i < gameObj.length; i++){
            User.updateUser(gameObj.players[i], game);
          }
        }
      });
    },
};