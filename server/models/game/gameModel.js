var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({    
  datePlayed: {
    type: Date,
    default: Date.now
  },
  players: [{
    name: String, // username
    totalXp: Number,
    xpEarned: Number,
    questionsAnswered: Number,
    questionsAnsweredCorrect: Number
  }]
});