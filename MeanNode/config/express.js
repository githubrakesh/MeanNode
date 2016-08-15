var config = require('./config'),
    express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    session = require('express-session'),
    winston = require('winston'),
    apiauth = require('../app/controllers/apiauth.server.controller');

//unless = require('express-unless');


module.exports = function () {
    var app = express();
    
    app.set('port_https', config.httpsport);
    
    app.all('*', function (req, res, next) {
        /*
            force all traffic get redirected to https
            if (req.secure) {
                return next();
            };
            res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
            });
        */ 
          var logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: 'somefile.log' })
            ]
        });
        logger.log('info', 'Hello distributed log files!');
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });
    
    //autenticated api requests
    app.all('/api/v1/*', function (req, res, next) {
        
        var token = req.headers['x-access-token'];
        if (token) {            
            apiauth.verifyToken(token, req);          
        
        } else {
            return res.status(403).send({
                success: false, 
                message: 'No token provided.'
            });
      
        }
    });
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.use(bodyParser.json());
    
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));
    
    
    app.use(function (req, res, next) {
        // logging to console.
        console.log('OK hm Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });
    
    
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    
    require('../app/routes/index.server.routes')(app);
    require('../app/routes/users.server.routes')(app);
    require('../app/routes/tickets.server.routes')(app);
    
    app.use(express.static('./public'));
    
    return app;
};