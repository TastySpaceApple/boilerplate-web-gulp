const express = require('express');
const app = express.Router();

app.get('/index-too', (req, res) => {
  res.render('index')
})

module.exports = app;