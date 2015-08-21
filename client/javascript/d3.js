
angular.module('app.d3', [])
.directive('dthree', function(){

  var color = 'purple';
  var w = 600;
  var h = w/2;
  
  return {
    restrict: 'EA',

    scope: false,

    link: function (scope, element, attrs) {
        var maxRadius = 10;

        var graph = d3.select(element[0]);
        
        var updateGraph = function(newValue){
          graph.selectAll('*').remove();
          var svgContainer = graph.append('svg')
              .attr('height', h)
              .attr('width', w)
              .classed('opponents', true);
          
          // background
          svgContainer.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "purple");

          maxOppRadius = d3.max(scope.d3values, function(opponent) {
            return opponent.level;
          });

          oppRadiusScale = d3.scale.linear()
            .domain([0, maxOppRadius])
            .range([0, maxRadius]);

          maxY = d3.max(scope.d3values, function(opponent) {
            return opponent.y;
          });
          maxX = d3.max(scope.d3values, function(opponent) {
            return opponent.x;
          });

          heightScale = d3.scale.linear()
            .domain([0, maxY])
            .range([maxRadius*2, h - maxRadius*2]);
          widthScale = d3.scale.linear()
            .domain([0, maxX])
            .range([maxRadius*2, w - maxRadius*2]);


          opponents = svgContainer.selectAll('circle.opponent')
            .data(scope.d3values)
            .enter()
            .append('circle')
            .attr('cx', w/2)
            .attr('cy', heightScale(h))
            .attr('r', function(opponent) {
              return oppRadiusScale(opponent.level);
            })
            .attr('class', function(opponent) {
              return opponent.name;
            });

          opponents
            .transition()
            .delay(1000)
            .attr('cx', function(opponent, i) {
              return widthScale(opponent.x);
            })
            .attr('cy', function(opponent, i) {
              return heightScale(h - opponent.y);
            });


        };    
        
        scope.$watch('d3values', function (newVal, oldVal) {
          updateGraph(scope.d3values);
        });
    }
  };
});
