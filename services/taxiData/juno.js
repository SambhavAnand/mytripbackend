//req's
const axios = require("axios");
const baseRideGuruRequest = axios.create({
  baseURL:"https://ride.guru/api",
})


const getPriceEstimate = (start_latitude, start_longitude, end_latitude, end_longitude, distance, duration) => {

  let random_start_a = Math.random().toString(36).substring(10);
  let random_end_a = Math.random().toString(36).substring(7);
  let start = String(start_latitude)+","+String(start_longitude);
  let end = String(end_latitude)+","+String(end_longitude);
  const params = {
    "start" : start,
    "start_a":random_start_a,
    "end" : end,
    "end_a" : random_end_a,
    "distance":distance,
    "duration":duration
  };
  return new Promise((resolve,reject)=>{
    baseRideGuruRequest.get("/fares.json",{params})
    .then(results => {return results.data.fare_estimates.filter(object => object.service.name.includes("Juno"))})
    .then(results => results.map(result => {
        return {
          rideType:result.service.name,
          displayName:result.service.name,
          priceHigh:result.total_fare,
          priceLow:result.total_fare
        }
      }))
    .then(prices => resolve(prices))
    .catch(error =>  reject(error))
  });
}

module.exports = {
  getJunoPrice: getPriceEstimate
};
