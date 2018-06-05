const axios = require('axios');
const {LYFT_SERVER_TOKEN} = require('../../config');

const baseLyftRequest = axios.create({
  baseURL: 'https://api.lyft.com/v1',
  headers: {
    'Authorization': `bearer ${LYFT_SERVER_TOKEN}`,
  }
});
const getPriceEstimate = (start_latitude, start_longitude, end_latitude, end_longitude) => {

  const params = {
    'start_lat': start_latitude,
    'start_lng': start_longitude,
    'end_lat': end_latitude,
    'end_lng': end_longitude
  };
  return new Promise((resolve, reject) => {
    baseLyftRequest.get('/cost', {params})
    .then(result => resolve(result.data))
    .catch(error => reject(error.message));
  });
}

module.exports = {
  getLyftPrice: getPriceEstimate
};
