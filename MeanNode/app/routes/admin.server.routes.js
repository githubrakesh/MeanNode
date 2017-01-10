/*jslint node: true */

"use strict";

const admin = require('../../app/controllers/admin.server.controller');

module.exports = function (app) {
    app.route('/add-category')
        .get(admin.renderCategory)
        .post(admin.addCategory);
    app.route('/api/faker/addProduct/:categoryName')
        .get(admin.addFakerProduct);

    app.route('/api/products/:categoryId')
        .get(admin.getProductsByCategory);
    app.route('/api/product/:Id')
        .get(admin.getProductById);

    app.route('/api/elastic/product/syncProductstoElastic')
        .get(admin.syncProductstoElastic);
    app.route('/products/:categoryId')
        .get(admin.renderProductsByCategory);
    app.route('/search')
        .post(function (req, res, next) {
            res.redirect('/search?q=' + req.body.q);
        })
        .get(admin.searchProduct);
    app.route('/api/products/:page/:perPage')
        .get(admin.getProducts);
};