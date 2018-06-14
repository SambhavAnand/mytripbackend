const spawn = require('child_process').spawn;

const getPriceEstimate = async (start_latitude, start_longitude, end_latitude, end_longitude, distance, duration) => {
  let result = "", pythonError="";
  return new Promise(async (resolve, reject) => {
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
