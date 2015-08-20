w = 800;
h = 240;
maxRadius = 40;

planetsArray = [
  {name: 'mercury', diam: 4879, dist: 57.9},
  {name: 'venus', diam: 12104, dist: 108.2},
  {name: 'earth', diam: 12756, dist: 149.6},
  {name: 'mars', diam: 6792, dist: 227.9},
];

svgContainer = d3.select('body')
  .append('svg')
  .attr('height', h)
  .attr('width', w)
  .classed('planets', true);

// d3.cvs('/planets.csv', function(planetsArray) {
  planets = svgContainer.selectAll('circle.planet')
    .data(planetsArray)
    .enter()
    .append('circle')
    .attr('cy', h/2)
    .attr('r', 10)
    .attr('cx', function(d, i) {
      return i * (w/planetsArray.length);
    });
// });
