// stats controller js here
(function() {

  var app = angular.module('Stats',[]);

  app.controller('StatsController', ['$scope', function($scope) {
    //nothing for now. Will add later.
    $scope.d3values = [1,2,3,4,5,6,7,8];
    $scope.d3values.push(8);
  }]);
})();
