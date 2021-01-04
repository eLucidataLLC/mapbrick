/*
https://gdal.org/programs/gdal_contour.html

gdal_contour -b 1 -a ELEV -i 100.0 -f "GeoJSON" Montserrat-topo.tif Montserrat100mfromGDAL.geojson
gdal_contour -b 1 -amin amin -amax amax -i 100.0 -f "GeoJSON" -p Montserrat-topo.tif Montserrat100mfromGDAL.geojson
gdal_contour -b 1 -amin amin -amax amax -i 150.0 -f "GeoJSON" -p Montserrat-topo.tif Montserrat150mfromGDAL.geojson
gdal_contour -b 1 -amin amin -amax amax -i 200.0 -f "GeoJSON" -p GMRTv3_8_20210102topo.tif Fuji2000m.geojson
 */
const fs = require('fs');
const turf = require('@turf/turf');
const D3Node = require('d3-node');
const d3 = require('d3');
const dataPath = '../data/';

const options = {
  styles: '.land{fill:#ccd7b2;stroke:#a7ba78;fill-opacity:.4;stroke-width:.5;stroke-linejoin:round;}.grid{fill:none;stroke:#bbb;opacity:.3;stroke-width:.5;}',
  d3Module: d3
};
const grid = JSON.parse(fs.readFileSync(dataPath + 'fuji-0.2km-square-grid.geojson'));
const data = JSON.parse(fs.readFileSync(dataPath + 'Fuji200m.geojson'));

// map svg ---------------------------------------------------------------

var d3n = new D3Node(options);

var width = 824;
var height = 680;
var projection = d3.geoMercator().fitSize([width, height], grid)
var path = d3.geoPath().projection(projection);

var svg = d3n.createSVG(width, height);

svg.append('rect')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('fill', '#fafafa');

svg.selectAll('.land')
  .data(data.features)
  .enter()
  .append('path')
  .attr('class', 'land')
  .attr('d', path);

svg.selectAll('.grid')
  .data(grid.features)
  .enter()
  .append('path')
  .attr('class', 'grid')
  .attr('d', path)

// var domain = Math.max(...individualsCount) - Math.floor(stats.stdev(individualsCount));
// var range = (cellSide > 3) ? Math.floor(cellSide * 3 / 2) : 5;
// var radius = d3.scaleSqrt()
//   .domain([0, domain])
//   .range([3, range])
//
// svg.selectAll('circle')
//   .data(cluster.features)
//   .enter().append('circle')
//   .attr('transform', function(d) {
//     return 'translate(' + path.centroid(d) + ')'
//   })
//   .attr('r', function(d) {
//     return radius(d.properties.individuals);
//   })
//   .attr('class', 'point');

// var legend = svg.append("g")
//   .attr("class", "legend")
//   .attr("transform", "translate(" + (width - 75) + "," + (height - 20) + ")")
//   .selectAll("g")
//   .data([0, domain / 2, domain])
//   .enter().append("g");
//
// legend.append("circle")
//   .attr("cy", function(d) {
//     return -2 * radius(d) ;
//   })
//   .attr("r", radius)
//   .attr('class', 'point');

fs.writeFileSync('../img/_mapFuji.svg', d3n.svgString(svg.node()));
