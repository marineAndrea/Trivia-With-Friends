var Game = require('./gameModel.js');
var User = require('../users/userModel');
var userController = require('../users/userController')

module.exports = {
    handleEndGame: function(gameObj) {
      var newGame = new Game({players: gameObj.players});
      newGame.save(function(err, game) {
        if (err) {
          console.log('error posting user', error);
        } else {
          console.log('handleendgame',gameObj);
          for (var i = 0; i < gameObj.players.length; i++){
            userController.updateUser(gameObj.players[i], game);
          }
        }
      });
    },
};