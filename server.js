const express = require('express');
const app = express();
const {taxiDataRoutes} = require('./routes');

const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  console.log('Request: ', req.url);
  next();
});
app.use('/taxi', taxiDataRoutes);

app.listen(port);
