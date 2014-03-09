'use strict';

var express = require('express');
var app = express();

// Require the logger, log entire app
require(__dirname + '/config/logger');

// Load express configuration
require(__dirname + '/config/env')(express, app);

// Load database
require(__dirname + '/config/database');

// Load routes
require(__dirname + '/routes')(app);

// Start the server
app.listen(3000);

global.logger.info('worker ' + process.pid + ' - Listening on port 3000');