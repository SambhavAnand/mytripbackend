const {GOOGLE_API_KEY} = require('../../config');
const spawn = require('child_process').spawn;
const googleMapsClient = require('@google/maps').createClient({
  key: GOOGLE_API_KEY,
  Promise: Promise
});


const getDistanceAndTime = (start_latitude, start_longitude, end_latitude, end_longitude) => {
  return new Promise((resolve, reject) => {
    googleMapsClient.distanceMatrix({
      origins: [`${start_latitude},${start_longitude}`],
      destinations: [`${end_latitude},${end_longitude}`],
      units: 'imperial'
    }).asPromise()
    .then(res=>res.json.rows[0].elements[0])
    .then(data=>{
      return {
        'distance': data.distance.text.split(' ')[0], //to conver to miles,
        'duration': data.duration.value //already in seconds
      }
    })
    .then(result=>resolve(result))
    .catch(err=>reject(err))
  });
}
const getPriceEstimate = async (start_latitude, start_longitude, end_latitude, end_longitude) => {
  let result = "", pythonError="";
  return new Promise(async (resolve, reject) => {
    const distanceAndTime = await getDistanceAndTime(start_latitude, start_longitude, end_latitude, end_longitude);
    const {distance, duration} = {...distanceAndTime};
    const pathToPythonScript = process.cwd() + '/services/taxiData/taxi_price_predictor.py'
    const model = spawn('python', [pathToPythonScript, distance, duration, start_longitude, start_latitude, 1]);
    model.stdout.on('data', function(data) {
      result+=data;
    });
    model.stdout.on('end', function(data) {
      resolve(parseFloat(result));
    });
    model.stderr.on('data', function(data) {
      pythonError+=data;
    });
    model.stderr.on('end', function() {
      if(pythonError) reject(pythonError);
    })
  });
}

module.exports = {
  getTaxiPrice: getPriceEstimate
}
