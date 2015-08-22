
angular.module('app.d3', [])
.directive('dthreeglobal', function(){

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
              .attr('height', 350)
              .attr('width', 725)
              .classed('opponents', true);
          
          // background
          // svgContainer.append("rect")
          //   .attr("width", "100%")
          //   .attr("height", "100%")
          //   .attr("fill", "purple");

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
})
.directive('dthreepersonal', function(){

  var color = 'purple';
  var w = 600;
  var h = w/2;
  
  return {
    restrict: 'EA',

    scope: false,

    link: function (scope, element, attrs) {
      var w = 800;
      var h = 350;
      var m = [0, 40, 40, 40]; // margins
      var updateGraph = function() {
        /////////////////////////////////////////* D3 VISUALIZATION */////////////////////////////////////////

        /* implementation heavily influenced by http://bl.ocks.org/1166403 */

        // create a simple userScores array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
        var userScores = [10, 40, 50, 20, 70, 100, 110, 80, 150, 180];
        // var meanScores = [10, 50, 80, 100, 110, 115, 118, 120, 121, 121];

        // X scale will fit all values from userScores[] within pixels 0-w
        var x = d3.scale.linear().domain([0, userScores.length]).range([0, w]);
        // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
        // var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
        // automatically determining max range can work something like this
        var y = d3.scale.linear().domain([0, d3.max(userScores)]).range([h, 0]);

        // create a line function that can convert userScores[] into x and y points
        var line = d3.svg.line()
         // assign the X function to plot our line as we wish
         .x(function(d,i) { 
           return x(i); 
         })
         .y(function(d) { 
           return y(d); 
         });

        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select(element[0]).append("svg:svg")
         .attr("class", "personalgraph")
         .attr("width", "100%")
         .attr("height", "100%")
         .append("svg:g")
         .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
        // Add the x-axis.
        graph.append("svg:g")
         .attr("width", "100%")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + h + ")")
         .call(xAxis);

        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
        // Add the y-axis to the left
        graph.append("svg:g")
         .attr("width", "100%")
         .attr("class", "y axis")
         .attr("transform", "translate(0,0)")
         .call(yAxisLeft)
         
        graph.append("text")
         .attr("class", "y label")
         .attr("text-anchor", "end")
         .attr("y", 6)
         .attr("dy", ".75em")
         .attr("transform", "rotate(-90)")
         .text("Score");
         
        graph.append("text")
          .attr("class", "x label")
          // .attr("x", w)
          .attr("y", h - 6)
          .text("Games Played");
        // Add the line by appending an svg:path element with the userScores line we created above
        // do this AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path")
          .attr("d", line(userScores))
          .attr("class", "path")   
      }    

      scope.$watch('d3values', function (newVal, oldVal) {
        updateGraph(scope.d3values);
      });
    }
  }
});
