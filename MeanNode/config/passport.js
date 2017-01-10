/*jslint node: true */

"use strict";
const passport = require('passport');
const mongoose = require('mongoose');

module.exports = function () {
    let User = mongoose.model('User');

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne(
            { _id: id },
            '-password',
            function (err, user) {
                done(err, user);
            }
        );
    });

    require('./strategies/local.js')();
    require('./strategies/facebook.js')();
    require('./strategies/twitter.js')();
};