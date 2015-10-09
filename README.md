# Project Name

> Trivia With Friends!

## Team

  - __Product Owner__: Harry Sadler
  - __Scrum Master__: Eric Fischer
  - __Development Team Members__: Nicolas Toscano, David Beckley, Marine Guillanton

## Table of Contents

TriviaWithFriends is a great way to challenge your friends to trivia showdowns! Finally figure out which one of you has more random knowledge of the world! TriviaWithFriends will keep track of your success (or lack of success) answering questions over time, so you can always check-in on your stats. Jump right in and see how you do!

Here is a link to the deployed version of our app: https://triviawithfriends.herokuapp.com/

We used the MEAN tech stack to create TriviaWithFriends: Mongoose, Express, Angular, and Node. Challenges during our project included finding the right API, structuring the optimal dynamics for the game, and having user information update appropriately.

Please read below for a detailed account of the functionality behind TriviaWithFriends!



1) CLIENT SIDE:


Navigation.js

Profile.js

Stats.js

Trivia.js

User.js (for user functions)

Index.html (includes nav)

Profile.html

Stats.html

 -Stats.personal.html
 
 -Stats.global.html
 
Trivia.html

 -Trivia.play.html
 
 -Trivia.endgame.html
 
Signin.html

Signup.html

App.js (route handling)



2) SERVER SIDE:


App.js (Our server--different file than the one in client)

Config

 -Helper
 
 -Middleware
 
Models

 Trivia:
 
 -TriviaController.js
 
 -TriviaModel.js
 
 -TriviaRoutes.js
 
 Users
 
 -UserController.js
 
 -UserModel.js
 
 -UserRoutes.js



3) TESTS:


Client-side:

-ProfileControllerSpec.js

-TriviaControllerSpec.js

-TriviaFactorySpec.js

-UserControllerSpec.js

Server-side:

-ServerSpec.js



4) ADDITIONAL FILES:


Bower.json (w/ language dependencies) & .bowerrc

.gitignore

.travis.yml (runs grunt test)

Gruntfile (runs jshint, mochaTest, and karma)

karma.conf (browser-side testing using Phantom.js)

Package.json (w/ module and developer dependencies)





1) FURTHER REVIEW OF CLIENT SIDE:

a) Navigation.js

b) Profile.js

c) Stats.js

d) Trivia.js

e) User.js (for user functions)

a) Index.html (includes nav)

b) Profile.html

c) Stats.html

 -Stats.personal.html
 
 -Stats.global.html
 
d) Trivia.html

 -Trivia.play.html
 
 -Trivia.endgame.html
 
e) Signin.html

   Signup.html

f) App.js (route handling)



a) Navigation.js and Index.html

Use $state service to communicate 'active' or '' to ng-class directive.
Use $location service to communicate false or true to ng-show directive.



b)Profile.js and Profile.html

Profile.js:

Profile factory:

Uses $http, $location, and $window services.
$http: facilitates communication between client and server side
$window: uses localStorage method to store data locally within the user's browser

Has a getUserData function with a username parameter and the following:

return $http.post('/api/users/profile', {
  username: username
}).then(function (res) {
  return res.data;
});

Step 1: Bounces to our middleware file:
app.use('/api/users', userRouter);

Step 2: Bounces to our userRouter file:
app.post('/profile', userController.getUserData);

Step 3: Bounces to userController and calls getUserData function, which returns a stringified JSON user object.

Profile controller:

Has the Profile Factory as a dependency

This is a great example of the user data being sent back from the database:

$scope.user = {
  "_id": "55ce9311dda321437709f35c",
  "salt": "$2a$10$gLPRaKFp3JG6J2M\/VOQ.uu",
  "username": "Bob",
  "password": "$2a$10$gLPRaKFp3JG6J2M\/VOQ.uuE67zxeljbSnSp8DfWpwkOMsPHDw1wwW",
  "__v": 0,
  "mostRecentGame": {
    "questionsAnsweredCorrect": 0,
    "questionsAnswered": 0,
    "xpEarned": 0,
  },
  "questionsAnsweredCorrect": 0,
  "questionsAnswered": 0,
  "wonLastGame": false,
  "bestCorrectStreak": 0,
  "gamesPlayed": 0,
  "totalXp": 0,
  "userLevel": 1
};

Profile.html:

With these key-value pairs in the $scope.user object, the profile html page renders the appropriate data for user.username, user.totalXp, etc. etc.



c) Stats.js and Stats.html
-Work in progress



d) Trivia.js and Trivia.html
Trivia.js:
Trivia Factory:
Uses $http service to do 2 things.
Query '/api/trivia', which is handled by our middleware.
And $http.put('/api/users', {}) is used to update the user in the database

Trivia Controller:

Notable dependency services include $http, $interval (for the timer), and $location.

In short, the trivia controller 1) calls methods laid out in the trivia factory, and 2) defines methods that are called from trivia.html, trivia.play.html, and trivia.endgame.html



e) User.js, signin.html, and signup.html
User.js defines the functions that are called from signin.html and signup.html.
User.js has a UserFactory and UserController.

UserFactory methods:
signin ($http.post sent to middleware)
signup ($http.post sent to middleware)
isAuth
signout

UserController methods:
signin
signup



f) App.js
Step 1: Declare app module with all dependencies
Step 2: app.config
Step 3: app.factory
Step 4: app.run

Step 4 in detail: In app.run, we want to make sure the user is authorized. We listen for when angular is trying to change routes. When it does change routes, we then look for the token in localstorage and send that token to the server to see if it is a real user or hasn't expired. If it's not valid, we then redirect back to signin/signup.



2) FURTHER REVIEW OF SERVER SIDE:

a) App.js (Our server--different file than the one in client)

b) Config

 -Helper
 
 -Middleware
 
c) Models

 Trivia:
 
 -TriviaController.js
 
 -TriviaModel.js
 
 -TriviaRoutes.js
 
 Users:
 
 -UserController.js
 
 -UserModel.js
 
 -UserRoutes.js

a) App.js (server)

  Express, mongoose, and server are initialized here.
  With a require statement, we inject our server and express into config/middleware.js for setup:

  require('./server/config/middleware.js')(app, express);

  We also export our server for easy testing.



b1) Middleware.js

  Requires all express middleware and sets it up.
  -morgan: for logging incoming requests
  -bodyParser: populates req.body with (among other things) the value of any given POST parameter
  -helpers: our custom middleware in helper.js (described next)

  We create 2 routers, the userRouter and triviaRouter, for these 2 features of our program.
  Each feature has its own folder with a model, controller, and route file.

  Our authentication is set up in middleware.js as well. It references our helper.js file:

  // authentication middleware used to decode token on a request to the server
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  Lastly, with another require statement, we inject our routers into their respective route files:

  require('../models/users/userRoutes.js')(userRouter);
  require('../models/trivia/triviaRoutes.js')(triviaRouter);



b2) Helper.js

  Requires jwt module, which lets us authenticate HTTP requests using JWT tokens (protects API endpoint)

  Has errorLogger and errorHandler functions, which log errors and send error messages to the client, respectively.

  Decode function decodes token and will attach said user to the request.



c) Models

c1) Trivia

  It makes most sense to explain the model, controller, and the routes in that order.

  I) triviaModel.js
  
  Requires mongoose.

  TriviaSchema contains:
  id
  answer

  Trivia model/schema is then exported:
  module.exports = mongoose.model('Trivia', TriviaSchema);



  II) triviaController.js
  
  Onto the triviaController. It requires the triviaModel, and Q module.
  var Trivia = require('./triviaModel.js');
  var Q = require('q');

  triviaController functions are within module.exports.

  Functions:
  checkAnswer: 
  Finds a question by id using Q.nbind, which creates a promise-returning function.

  var findQuestion = Q.nbind(Trivia.findOne, Trivia);
  -Trivia refers to our model



  III) triviaRoutes.js
  
  Requires the triviaController and unirest.
  -unirest was a module recommended by our API
  All triviaRoutes are within module.exports.

  POST request to '/': call checkAnswer in triviaController.
  GET request to '/': query API for 10 questions



c2) Users

  It makes most sense to explain the model, controller, and the routes in that order.

  I) userModel.js:
  
  Requires mongoose, bcrypt, and Q modules.
  -mongoose: used for database schemas; works in an asynchronous environment
  -bcyrpt: hashes and safely stores passwords
  -Q: Uses promises and the "then" method to eliminate need for callbacks.

  UserSchema using mongoose contains:
  username
  password
  salt
  totalXp
  gamesPlayed
  bestGameScore
  bestCorrectStreak
  questionsAnswered
  questionsAnsweredCorrect
  mostRecentGame
   -xpEarned
   -questionsAnswered
   -questionsAnsweredCorrect

  UserSchema has 2 functions:
  comparePasswords: uses Q and bcrypt to compare an entered password with the actual saved password. Convenience method for comparing passwords later on.

  UserSchema.pre('save' ... : uses a 'pre' hook and bcrypt to generate salt and hash password. The hooked method, in this case save, will not be executed until the password is hashed.

  User model/schema is then exported.



  II) userController.js:
  
  Onto the UserController. It requires the userModel, Q module, and jwt.
  All UserController functions are within module.exports.

  Functions:

  updateUser:
  Gets the variables username, score, correct, correctStreak, and answered as properties of req.body.
  Finds a user in the database using Q.nbind, which creates a promise-returning function.

  var findUser = Q.nbind(User.findOne, User);
  -User, remember, is our mongoose model
  -.findOne is a method to query the database

  findUser then finds a user and, using .then promises, updates them in the database.

  signin:
  Uses Q.nbind again to find the user. Then uses the comparePasswords function from UserModel to sign-in or reject the attempted sign-in.

  signup:
  Creates a new user with the following:
  create = Q.nbind(User.create, User);

  checkAuth:
  Checks to see if the user is authenticated. Grabs the token, if any, in the header and then decodes it. It ends up as user object, which is used to see if the user exists in the database.

  getUserData:
  Finds the user again using Q.nbind. And if found, respond with a stringified JSON object of the user.



  III) userRoutes.js:
  
  Requires the userController.
  All UserRoutes are within module.exports.

  On a put, post, or get request from a specific page, the appropriate function in UserController will be called.
*/



## Usage

> Some usage instructions

## Requirements

- Node 0.10.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
