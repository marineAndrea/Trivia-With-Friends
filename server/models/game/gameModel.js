var mongoose = require('mongoose');


var GameSchema = new mongoose.Schema({    
  datePlayed: {
    type: Date,
    default: Date.now
  },
  players: [{
    name: String, // username
    cumulativeScore: Number,
    gameScore: Number,
    questionsAnswered: {
      type: Number,
      default: 0
    },
    questionsAnsweredCorrect: {
      type: Number,
      default: 0
    }
  }]
});

module.exports = mongoose.model('games', GameSchema);
