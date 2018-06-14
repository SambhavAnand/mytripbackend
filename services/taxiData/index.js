const {getUberPrice} = require('./uber');
const {getLyftPrice} = require('./lyft');
const {getTaxiPrice} = require('./taxi');
const {getJunoPrice} = require('./juno');
const {GOOGLE_API_KEY} = require('../../config');
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
  let result = {};
  return new Promise(async (resolve, reject) => {
    const distanceAndTime = await getDistanceAndTime(start_latitude, start_longitude, end_latitude, end_longitude);
    const {distance, duration} = {...distanceAndTime};
    const pricePromises = [
      getUberPrice(start_latitude, start_longitude, end_latitude, end_longitude),
      getLyftPrice(start_latitude, start_longitude, end_latitude, end_longitude),
      getJunoPrice(start_latitude, start_longitude, end_latitude, end_longitude, distance*1609.4,duration),//Convert to meters for Juno
      getTaxiPrice(start_latitude, start_longitude, end_latitude, end_longitude, distance, duration)
    ];
    Promise.all(pricePromises)
    .then(prices=>{
      const uberPrices = prices[0].prices;
      const lyftPrices = prices[1].cost_estimates;
      const junoPrices = prices[2];
      result['uber'] = uberPrices.map(product => {
        return {
          rideType: product.localized_display_name,
          displayName: product.display_name,
          priceHigh: product.high_estimate,
          priceLow: product.low_estimate,
          productId: product.product_id,
          currency: product.currency_code
        }
      });
      result['lyft'] = lyftPrices.map(product => {
        return {
          rideType: product.ride_type,
          displayName: product.display_name,
          priceHigh: product.estimated_cost_cents_max,
          priceLow: product.estimated_cost_cents_min,
          priceQuoteId: product.price_quote_id,
          currency: product.currency
        }
      });
      result['juno'] = junoPrices;
      result['taxi'] = prices[3];
      resolve(result)
    })
    .catch(error=> reject(error));
  });
}

module.exports = {
  getPriceEstimate: getPriceEstimate,
}
