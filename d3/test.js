var widthGenerator = function(min, max) {
  var res = Math.random() * (max - min) + min;
  console.log('res', res);
  return res;
};

console.log('random', widthGenerator(20, 780));

var w = 800;
var h = 240;
var maxRadius = 10;
 // a     b     c       d       e 
 // red   blue  yellow  violet  green 
 // a     e     b       d       c
 // red   green blue    violet  yellow
/*var opponentsArr = [
  {name: 'a', score: 10, ngp: 0},
  {name: 'b', score: 5, ngp: 2},
  {name: 'c', score: 15, ngp: 4},
  {name: 'd', score: 20, ngp: 3},
  {name: 'e', score: 15, ngp: 1},
];*/

var opponentsArr = [
  {name: 'a', score: 10, ngp: 10},
  {name: 'b', score: 5, ngp: 8},
  {name: 'c', score: 15, ngp: 5},
  {name: 'd', score: 20, ngp: 0},
  {name: 'e', score: 15, ngp: 7},
];

svgContainer = d3.select('body')
  .append('svg')
  .attr('height', h)
  .attr('width', w)
  .classed('opponents', true);

maxOppRadius = d3.max(opponentsArr, function(opponent) {
  console.log('opponent.score/2', opponent.score/2);
  return opponent.score/2;
});

oppRadiusScale = d3.scale.linear()
  .domain([0, maxOppRadius])
  .range([0, maxRadius]);


maxNgp = d3.max(opponentsArr, function(opponent) {
  console.log('opponent.ngp', opponent.ngp);
  return opponent.ngp;
});

heightScale = d3.scale.linear()
  .domain([0, maxNgp])
  .range([maxRadius*2, h - maxRadius*2]);

opponents = svgContainer.selectAll('circle.opponent')
  .data(opponentsArr)
  .enter()
  .append('circle')
  .attr('cx', w/2) 
  // .attr('cx', widthGenerator(20, 780))
  .attr('r', function(opponent) {
    return oppRadiusScale(opponent.score/2);
  })
  .attr('class', function(opponent) {
    return opponent.name;
  })
  .attr('cy', h - maxRadius*2);

opponents
  .transition()
  .delay(1000)
  .attr('cy', function(opponent, i) {
    return heightScale(opponent.ngp);
  })
  // get random value between maxRadius*2 and w - maxRadius*2
  .attr('cx', function(opponent, i) {
    return widthGenerator(20, 780);
  });



