/*jslint node: true */

"use strict";

const jwt = require('jsonwebtoken');
const config = require('../../config/config');

exports.getToken = function (user) {
    var token = jwt.sign(user, config.sessionSecret, {
        expiresIn: config.tokenExpiration
    });
    return token;
};

exports.verifyToken = function (token, res, next) {
    jwt.verify(token, config.sessionSecret, function (err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
            next();
        }
    });
};