"use strict";

const Cop = require('./models/cop');
function updateLocation(userId, coordinates, callback) {

    Cop.findOne({ userId: userId }, function (err, user) {
        if (err) callback(err);
        user.location
    });
}