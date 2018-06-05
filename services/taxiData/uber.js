const axios = require('axios');
const {UBER_SERVER_TOKEN} = require('../../config');

const baseUberRequest = axios.create({
  baseURL: 'https://api.uber.com/v1.2',
  headers: {
    'Authorization': `Token ${UBER_SERVER_TOKEN}`,
    'Content-Type': `application/json`,
    'Accept-Language': `en_US`
  }
});
const getPriceEstimate = (start_latitude, start_longitude, end_latitude, end_longitude) => {

  const params = {
    'start_latitude': start_latitude,
    'start_longitude': start_longitude,
    'end_latitude': end_latitude,
    'end_longitude': end_longitude
  };
  return new Promise((resolve, reject) => {
    baseUberRequest.get('/estimates/price', {params})
    .then(result => resolve(result.data))
    .catch(error => reject(error.message));
  });
}

module.exports = {
  getUberPrice: getPriceEstimate
};
