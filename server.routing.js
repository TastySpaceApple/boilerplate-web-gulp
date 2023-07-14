const express = require('express');
const app = express.Router();

app.use('/assets', express.static('./assets'));

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/index-too', (req, res) => {
  res.render('index')
})

module.exports = app;