/////////////////////////////////////////* SETTINGS */////////////////////////////////////////

var w = 800;
var h = w/2;
var m = [80, 80, 80, 80]; // margins

/////////////////////////////////////////* D3 VISUALIZATION */////////////////////////////////////////

/* implementation heavily influenced by http://bl.ocks.org/1166403 */

  // create a simple userScores array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
  var userScores = [20, 10, 80, 50, 100, 80, 70, 100, 140, 150, 200, 220, 230, 180, 160, 200, 280, 300, 350, 360];

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
  var graph = d3.select("#graph").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  // create yAxis
  var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
  // Add the x-axis.
  graph.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

  // create left yAxis
  var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
  // Add the y-axis to the left
  graph.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(-25,0)")
    .call(yAxisLeft);
    
    // Add the line by appending an svg:path element with the userScores line we created above
    // do this AFTER the axes above so that the line is above the tick-lines
    graph.append("svg:path").attr("d", line(userScores));

