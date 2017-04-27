
/*jslint node: true */
"use strict";

const shop = require('../../app/controllers/shop.server.controller');

module.exports = function (app) {
    app.route('/api/v1/cart/:ownerId')
        .get(shop.getCartByOwner);//    
    app.route('/api/v1/cart/add')
        .post(shop.addItemToCart);// add the items to cart 
    app.route('/api/v1/cart/remove')
        .delete(shop.remItemFromCart); // remove items from cart
};