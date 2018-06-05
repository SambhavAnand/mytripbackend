const {getUberPrice} = require('./uber');
const {getLyftPrice} = require('./lyft');
const {getTaxiPrice} = require('./taxi');


const getPriceEstimate = (start_latitude, start_longitude, end_latitude, end_longitude) => {
  let result = {};
  return new Promise((resolve, reject) => {
    const taxiPromises = [
      getUberPrice(start_latitude, start_longitude, end_latitude, end_longitude),
      getLyftPrice(start_latitude, start_longitude, end_latitude, end_longitude),
      getTaxiPrice(start_latitude, start_longitude, end_latitude, end_longitude)
    ];
    Promise.all(taxiPromises)
    .then(prices=>{
      const uberPrices = prices[0].prices;
      const lyftPrices = prices[1].cost_estimates;
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
      result['taxi'] = prices[2];
      resolve(result)
    })
    .catch(error=> reject(error));
  });
}

module.exports = {
  getPriceEstimate: getPriceEstimate,
}
