const router = require('express').Router();

const {getPriceEstimate} = require('../services/taxiData');

router.get('/price', (req, res) => {
  const {
  start_latitude,
  start_longitude,
  end_latitude,
  end_longitude
} = { ...req.query};
  getPriceEstimate(start_latitude, start_longitude, end_latitude, end_longitude)
    .then(result=>res.send(result))
    .catch(error=>res.sendStatus(500));
});

module.exports = router;
