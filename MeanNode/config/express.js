/*jslint node: true */
"use strict";

const config = require('./config');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const apiauth = require('../app/controllers/apiauth.server.controller');
const ejs = require('ejs');
const ejsmate = require('ejs-mate');
const logger = require('./logger');
//unless = require('express-unless');



module.exports = function () {
    let app = express();
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

    //handle any global errors here
    app.use(function (err, req, res, next) {
        logger.log('error', err.stack);
        res.status(500).send({ "Error": err.stack });
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
    app.engine('ejs', ejsmate);
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/routes/index.server.routes')(app);
    require('../app/routes/users.server.routes')(app);
    require('../app/routes/tickets.server.routes')(app);
    require('../app/routes/admin.server.routes')(app);

    app.use(express.static('./public'));

    return app;
};