/*
node generategrid.js 10 10
generategrid.js takes 2 arguments:
args[0] = cellSide (10 by default)
args[1] = borderSize (0 by default)
*/

const fs = require('fs');
const turf = require('@turf/turf');

const dataPath = '../data/';
const inputData = [{
  label: 'montserrat',
  data: 'Montserrat200mPoly.geojson'
}];
const _i = inputData[0];
const debug = true;
const gridedArea = JSON.parse(fs.readFileSync(dataPath + _i.data));

let args = process.argv.slice(2);
let cellSide = +args[0] || 10; //km
let borderSize = +args[1] || 0; //  km
let options = {
  units: 'kilometers'
};
console.time();

let extent = gridedArea;

let enveloped = turf.envelope(extent);
let buffered = turf.buffer(enveloped, borderSize, options);
let bbox = turf.bbox(buffered);
let squareGrid = turf.squareGrid(bbox, cellSide, options);

console.timeEnd();
console.log('%skm square grid done!', cellSide);

if (debug) {
  console.dir(turf.truncate(squareGrid), {
    depth: null
  });
}

fs.writeFileSync(dataPath + _i.label + '-' + cellSide + 'km-square-grid.geojson', JSON.stringify(turf.truncate(squareGrid)));
