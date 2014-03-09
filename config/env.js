'use strict';

var st = require('st');

module.exports = function(express, app) {
    var RedisStore = require('connect-redis')(express);

    app.configure(function() {
        if (process.env.NODE_ENV !== 'production') {
            var logStream = require('fs').createWriteStream(__dirname + '/../logs/app.log', {flags: 'a'});
            app.use(express.logger({
                stream: logStream,
                format: '\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time\x1b[0mms\x1b[33m :status\x1b[0m'
            }));
        }

        app.use(express.compress()); // gzip / deflate
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.cookieParser());
        app.use(express.responseTime());

        app.use(express.session({
            secret: 'xxx',
            maxAge: new Date(Date.now() + (3600000 * 24)), //1 Hour * 24
            store: new RedisStore
        }));

        // Some dynamic view helpers
        app.use(function(req, res, next) {
            res.locals.env = function() {
                if (typeof process.env.NODE_ENV !== 'undefined') {
                    return process.env.NODE_ENV;
                }
            };

            next();
        });

        app.use(express.methodOverride());
        app.use(app.router);

        app.use(st({ path: __dirname + '/../public', passthrough: true }));

        // Setup ejs views as default, with .html as the extension
        app.engine('ejs', require('ejs').renderFile);
        app.set('view engine', 'ejs');
        app.set('views', __dirname + '/../views');

        app.enable('trust proxy');

        // Development specific configuration
        app.configure('development', function() {
            app.use(express.errorHandler({
                dumpExceptions: true,
                showStack: true
            }));
        });

        // Production specific configuration
        app.configure('production', function() {
            app.use(express.errorHandler());
        });

        // Example 500 page
        app.use(function(err, req, res, next) {
            res.render('500', { error: err });
        });

        // Example 404 page via simple Connect middleware
        app.use(function(req, res, next) {
            res.render('404', { url: req.originalUrl });
        });
    });
};