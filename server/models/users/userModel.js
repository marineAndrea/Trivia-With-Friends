var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var SALT_WORK_FACTOR  = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String,
  userLevel: {
    type: Number,
    default: 1
  },
  totalXp: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  bestGameScore: {
    type: Number,
    default: 0
  },
  bestCorrectStreak: {
    type: Number,
    default: 0
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  questionsAnsweredCorrect: {
    type: Number,
    default: 0
  },
  games: [{type: String}],
 


///////// please ignore
  mostRecentGame: {
    xpEarned: {
      type: Number,
      default: 0
    },
    questionsAnswered: {
      type: Number,
      default: 0
    },
    questionsAnsweredCorrect: {
      type: Number,
      default: 0
    }
  }
});

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var defer = Q.defer();
  var savedPassword = this.password;
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
