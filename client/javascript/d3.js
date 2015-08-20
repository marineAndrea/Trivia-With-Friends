
angular.module('app.d3', [])
.directive('dthree', function(){
  var width = '100%';
  var height = '100%';
  var color = 'purple';

  return {
    restrict: 'EA',

    scope: false,

    link: function (scope, element, attrs) {
        console.log(element);
        var graph = d3.select(element[0]);
        
        var updateGraph = function(newValue){
          graph.selectAll('*').remove();
          var svg = graph.append('svg')
              .attr('width', width)
              .attr('height', height);
            
          svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "purple");

          svg.selectAll('p').data(scope.d3values)
            .enter().append('rect')
            .attr('fill', 'yellow')
            .attr('width', '10px')
            .attr('height', '10px');
        };    
        
        scope.$watch('d3values', function (newVal, oldVal) {
          updateGraph(scope.d3values);
        });
    }
  };
});
