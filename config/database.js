'use strict';

var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
var mongoose = require('mongoose');
var fs = require('fs');

/**
 * Bootstrap db connection
 */

var connect = function() {
  var options = {server: {socketOptions: {keepAlive: 1}}};
  mongoose.connect(config.db, options);
};

connect();

// Error handler
mongoose.connection.on('error', function(err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function() {
  connect();
});

// Bootstrap models
var modelsPath = __dirname + '/../models';
fs.readdirSync(modelsPath).forEach(function(file) {
  if (file.indexOf('.js') > -1) {
    require(modelsPath + '/' + file);
  }
});