/*
https://gdal.org/programs/gdal_contour.html

gdal_contour -b 1 -a ELEV -i 100.0 -f "GeoJSON" Montserrat-topo.tif Montserrat100mfromGDAL.geojson
gdal_contour -b 1 -amin amin -amax amax -i 100.0 -f "GeoJSON" -p Montserrat-topo.tif Montserrat100mfromGDAL.geojson
gdal_contour -b 1 -amin amin -amax amax -i 150.0 -f "GeoJSON" -p Montserrat-topo.tif Montserrat150mfromGDAL.geojson
gdal_contour -b 1 -amin amin -amax amax -i 200.0 -f "GeoJSON" -p GMRTv3_8_20210102topo.tif Fuji2000m.geojson

https://github.com/d3/d3-scale-chromatic
 */
const fs = require('fs');
const turf = require('@turf/turf');
const D3Node = require('d3-node');
const d3 = require('d3');
const dataPath = '../data/';

const options = {
  styles: '.land{fill:none;stroke:#111;opacity:.4;stroke-width:.5;stroke-linejoin:round;}.grid{fill:none;stroke:#bbb;opacity:.5;stroke-width:.5;}',
  d3Module: d3
};
const inputData = [{
    label: 'montserrat',
    data: 'Montserrat150mfromGDAL.geojson',
    grid: 'montserrat-0.15km-square-grid.geojson'
  },
  {
    label: 'fuji',
    data: 'Fuji200m.geojson',
    grid: 'fuji-0.2km-square-grid.geojson'
  }
];
const _i = inputData[0];
const grid = JSON.parse(fs.readFileSync(dataPath + _i.grid));
const data = JSON.parse(fs.readFileSync(dataPath + _i.data));
const bricks = JSON.parse(fs.readFileSync(dataPath + _i.label + '-bricks.geojson'));

// map svg ---------------------------------------------------------------

var d3n = new D3Node(options);

var width = 824;
var height = 680;
var projection = d3.geoMercator().fitSize([width, height], grid)
var path = d3.geoPath().projection(projection);

var svg = d3n.createSVG(width, height);
var colours = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB", "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63", "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"];

var color = d3.scaleOrdinal()
  .domain([0, 16])
  // .range(colours);
  .range(d3.schemePaired);

svg.append('rect')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('fill', '#fafafa');

svg.selectAll('.land')
  .data(bricks.features)
  .enter()
  .append('path')
  .attr('d', path)
  .attr('fill', d => color(d.properties.contour))
  .attr("fill-opacity", 0.85)

svg.selectAll('.land')
  .data(data.features)
  .enter()
  .append('path')
  .attr('class', 'land')
  .attr('d', path)
svg.selectAll('.grid')
  .data(grid.features)
  .enter()
  .append('path')
  .attr('class', 'grid')
  .attr('d', path)

fs.writeFileSync('../img/_' + _i.label + '.svg', d3n.svgString(svg.node()));
