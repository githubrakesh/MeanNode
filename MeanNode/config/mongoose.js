/*jslint node: true */

"use strict";
const config = require('./config');
const mongoose = require('mongoose');

module.exports = function () {
    const db = mongoose.connect(config.db);
    require('../app/models/user.server.model');
    require('../app/models/ticket.server.model');
    require('../app/models/category.server.model');
    require('../app/models/product.server.model');
    require('../app/models/cart.server.model');
    return db;
};