/*

*/
const fs = require('fs');
const turf = require('@turf/turf');
const dataPath = '../data/';

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

const MaxCons = (array) => {
  for (var i = 0; i < array.length; i++) {
    maxCons = array[i];
    if (!(array[i + 1] && (array[i + 1] - array[i] === 1))) {
      break;
    }
  }
  return maxCons;
};

const _i = inputData[0];
const grid = JSON.parse(fs.readFileSync(dataPath + _i.grid));
const data = JSON.parse(fs.readFileSync(dataPath + _i.data));

// data.features = data.features.sort((a, b) => (a.properties.ID > b.properties.ID) ? 1 : -1);

const areaBrick1x1 = turf.area(grid.features[0]);
turf.featureEach(grid, function(currentFeature, featureIndex) {
  contourArr = [];
  for (var feature in data.features) {
    if (data.features.hasOwnProperty(feature)) {
      let contour = data.features[feature];
      for (var i = 0; i < contour.geometry.coordinates.length; i++) {
        let sharingShape = turf.intersect(turf.polygon([contour.geometry.coordinates[i][0]]), currentFeature.geometry);
        if (sharingShape && turf.pointsWithinPolygon(turf.centroid(currentFeature), turf.polygon([contour.geometry.coordinates[i][0]]))) {
          if (turf.area(sharingShape) > areaBrick1x1 * .5) {
            contourArr.push(contour.properties.ID);
          };
          break;
        };
      };
    };
  };
  currentFeature.properties.contour = MaxCons(contourArr);
  console.log(featureIndex + '\t' + currentFeature.properties.contour + '\t' + contourArr);

});
fs.writeFileSync(dataPath + _i.label + '-bricks.geojson', JSON.stringify(grid));
