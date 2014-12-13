'use strict';

var homepage = require('../controllers/homepage');

module.exports = function(app) {
  app.get('/', homepage.index);
};