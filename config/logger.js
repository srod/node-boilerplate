'use strict';

var winston = require('winston');

/**
 * Set logger
 */
global.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: 'logs/app.log',
      colorize: true,
      timestamp: true,
      maxsize: 10485760, // 10 Mb
      maxFiles: 1,
      json: false
    })
  ]
});