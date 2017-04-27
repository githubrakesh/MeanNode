/*jslint node: true */

"use strict";

const Cart = require('../models/cart.server.model');

module.exports = {
    getCartByOwner: function (req, res, next) {
        Cart.findOne({ owner: req.params.ownerId }, function (err, cart) {
            if (err) return next(err);
            if (cart) {
                res.json({ 'cart': cart });
            } else {
                next();
            }
        });
    },
    addItemToCart: function (req, res, next) {
        Cart.findOne({ owner: req.body.userId },
            function (err, cart) {
                if (cart) {
                    cart.items.push({
                        item: req.body.productId,
                        price: parseFloat(req.body.priceVal),
                        quantity: parseInt(req.body.quantity)
                    });
                } else {
                    cart = new Cart({ owner: req.body.userId });
                    cart.items.push({
                        item: req.body.productId,
                        quantity: parseInt(req.body.quantity),
                        price: parseFloat(req.body.priceVal)
                    });
                }
                cart.total = (cart.total + parseFloat(req.body.priceVal)).toFixed(2);
                cart.save(function (err) {
                    if (err) return next(err);
                    return res.json({ 'message': 'Added to cart' });
                });
            });
    },
    remItemFromCart: function (req, res, next) {
        Cart.findOne({ owner: req.body.userId }, function (err, cart) {
            if (err) return next(err);
            //Notice: Mongoose's array pull method will work with matching primitive values 
            //but with subdocument objects it will only match on _id
            cart.items.pull(String(req.body.item));//??
            cart.total = (cart.total - parseFloat(req.body.price)).toFixed(2);
            cart.save(function (err) {
                if (err) return next(err);
                return res.json({ 'message': 'Removed item from cart' });
            });
        });
    }
};