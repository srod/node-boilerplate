'use strict';

var env = process.env.NODE_ENV || 'development';
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = function(express, app) {
  if (process.env.NODE_ENV !== 'production') {
    var logStream = require('fs').createWriteStream(__dirname + '/../logs/app.log', {flags: 'a'});
    app.use(require('morgan')({
      stream: logStream,
      format: '\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time\x1b[0mms\x1b[33m :status\x1b[0m'
    }));
  }

  app.use(require('compression')()); // gzip / deflate
  app.use(require('body-parser')());
  app.use(require('cookie-parser')());
  app.use(require('response-time')());

  app.use(session({
    store: new RedisStore(),
    secret: 'keyboard cat'
  }));

  // Load routes
  require(__dirname + '/../routes')(app);

  // Some dynamic view helpers
  app.use(function(req, res, next) {
    res.locals.env = function() {
      if (typeof process.env.NODE_ENV !== 'undefined') {
        return process.env.NODE_ENV;
      }
    };

    next();
  });

  app.use(require('method-override')());
  app.use(require('st')({
    path: __dirname + '/../public',
    passthrough: true
  }));

  // Setup ejs views as default
  app.engine('ejs', require('ejs').renderFile);
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/../views');

  app.enable('trust proxy');

  // Development specific configuration
  if (env === 'development') {
    app.use(require('errorhandler')({
      dumpExceptions: true,
      showStack: true
    }));
  }

  // Production specific configuration
  if (env === 'production') {
    app.use(require('errorhandler')());
  }

  // Example 500 page
  app.use(function(err, req, res, next) {
    res.render('500', {error: err});
  });

  // Example 404 page via simple Connect middleware
  app.use(function(req, res, next) {
    res.render('404', {url: req.originalUrl});
  });
};