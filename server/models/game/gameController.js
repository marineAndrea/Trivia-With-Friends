var Game = require('./gameModel.js');
var User = require('../users/userModel');
module.exports = {
    handleEndGame: function(gameObj) {
      var game = new Game({players: gameObj.players});
      game.save(function(err, game) {
        if (err) {
          console.log('error posting user', error);
        } else {
          for (var i = 0; i < gameObj.length; i++){
            User.updateUser(gameObj[i]);
          }
        }
      });
      // TODO: update users
      // TODO: save game onto database

    };
};