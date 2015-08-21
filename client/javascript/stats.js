// stats controller js here
(function() {

  var app = angular.module('Stats',[]);
  app.factory('StatRequests', ['$http', '$window', function($http, $window){
    var username = $window.localStorage.getItem('com.TriviaWithFriends.username')

    return {
      getGlobalStats: function(){
        $http.get({
          url: '/playercount/' + username,
        });
      },

      getPersonalStats: function(){

      },

      processGlobalStats: function(opponents, width, height) {
        var findMaxNgp = function(arr) {
          var max = 0;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].ngp > max) {
              max = arr[i].ngp;
            }
          }
          return max;
        };

        var completeTheYs = function(arr, h) {
          var maxNgp = findMaxNgp(arr);
          for (var i = 0; i < arr.length; i++) {
            var y = maxNgp - arr[i].ngp;
            var propY = Math.floor((y * h) / (maxNgp));
            arr[i].y = propY;
          }
          return arr;
        };

        var xGenerator = function(min, max) {
          var res = Math.random() * ((max - min)/10) + (min/10);
          res = Math.floor(res);
          res = res * 10;
          return res;
        };

        var findX = function(w, y) {
          var min = (w / 2) - y;
          var max = (w / 2) + y;
          return xGenerator(min, max);
        };

        var getDiff = function(w, x) {
          var m = w/2;
          var diff;
          if (x >= m) {
            diff = x - m;
          } else {
            diff = m - x;
          }
          return diff;
        };

        var getSin = function(h, d) { // hypothenuse, diff
          var res = (h*h - d*d);
          res = Math.sqrt(res);
          return res;
        };

        var findY = function(w, x, y) {
          var d = getDiff(w, x);
          var res = Math.round(getSin(y, d));
          return res;
        };

        var CompleteXandY = function(arr, w, h) {
          // get the ys
          var output = completeTheYs(arr, h);
          for (var i = 0; i < output.length; i++) {
            var y = output[i].y;
            var x = findX(w, y);
            // find x given y
            // given x find new y (or sin)
              // given x find diff
              // given diff find sin
            y = findY(w, x, y);
            output[i].x = x;
            output[i].y = y;
          }
          return output;
        }

        return CompleteXandY(opponents, width, height);
      }
    }
  }]);

  app.controller('StatsController', ['$scope', '$location','$stateParams','$state', 'StatRequests', function($scope, $location, $stateParams, $state, StatRequests) {
    //nothing for now. Will add later.
    var opponents = [
      {name: 'a', level: 15, ngp: 0},
      {name: 'b', level: 5, ngp: 5},
      {name: 'c', level: 4, ngp: 10},
      {name: 'd', level: 8, ngp: 15},
      {name: 'a', level: 13, ngp: 0},
      {name: 'b', level: 5, ngp: 5},
      {name: 'c', level: 4, ngp: 10},
      {name: 'd', level: 8, ngp: 15},
      {name: 'a', level: 10, ngp: 0},
      {name: 'b', level: 5, ngp: 5},
      {name: 'c', level: 4, ngp: 10},
      {name: 'd', level: 8, ngp: 15},
      {name: 'a', level: 12, ngp: 0},
      {name: 'b', level: 5, ngp: 5},
      {name: 'c', level: 4, ngp: 10},
      {name: 'd', level: 8, ngp: 15},
      {name: 'a', level: 10, ngp: 0},
      {name: 'b', level: 5, ngp: 5},
      {name: 'c', level: 4, ngp: 10},
      {name: 'd', level: 8, ngp: 15},
      {name: 'a', level: 10, ngp: 0},
      {name: 'b', level: 5, ngp: 5},
      {name: 'c', level: 4, ngp: 10},
      {name: 'd', level: 8, ngp: 15},
      {name: 'a', level: 11, ngp: 0},
      {name: 'b', level: 5, ngp: 5},
      {name: 'c', level: 4, ngp: 10},
      {name: 'd', level: 8, ngp: 15},
      {name: 'a', level: 10, ngp: 0},
      {name: 'b', level: 5, ngp: 5},
      {name: 'c', level: 4, ngp: 10},
      {name: 'd', level: 8, ngp: 15},
    ];

    var w = 600;
    var h = w/2;

    $scope.d3values = StatRequests.processGlobalStats(opponents, w, h);

    $scope.goToGlobal = function(){
      // $scope.d3values = StatRequests.getGlobalStats()
      $state.go('stats.global');
    };

    $scope.goToPersonal = function(){
      // $scope.d3values = StatRequests.getPersonalStats();
      $state.go('stats.personal'); 
    };

    // replace with a real function
    var getGlobalStats = function(){
      return [6,7,8,9,10];
    };

    var getPersonalStats = function(){
      return [1,2,3,4,5];
    };
    
  }]);
})();
