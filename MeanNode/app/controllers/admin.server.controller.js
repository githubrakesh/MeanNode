/*jslint node: true */

"use strict";
let Category = require('mongoose').model('Category');
let Product = require('mongoose').model('Product');
const async = require('async');
const faker = require('faker');

module.exports = {
    addCategory: function (req, res, next) {
        var category = new Category();
        category.name = req.body.name;
        category.save(function (err) {
            if (err) return next(err);
            req.flash('success', 'successfully added a category');
            return res.redirect('/add-category');
        });
    },
    renderCategory: function (req, res, next) {
        res.render('admin/add-category', { message: req.flash('success') });
    },
    addFakerProduct: function (req, res, next) {
        async.waterfall([
            function (callback) {
                Category.findOne({ name: req.params.name }, function (err, category) {
                    if (err) return next(err);
                    callback(null, category);
                });
            },
            function (callback, category) {
                for (var i = 0; i < 20; i++) {
                    var product = new Product();
                    product.category = category._id;
                    product.name = faker.commerce.productName();
                    product.price = faker.commerce.price();
                    product.image = faker.image.image();
                    product.save();

                    // TO Do - move this to the model
                    product.on('es-indexed', function (err, res) {
                        console.log("Product es indexed");
                    });
                }
            }
        ]);
        res.json({ message: 'added successfully' });
    },
    getProductsByCategory: function (req, res, next) {
        getProductsByCategory(req, res, function (products) {
            res.json(products);
        });
    },
    getProducts: function (req, res, next) {
        const perPage = parseInt(req.params.perPage) || 5;
        let page = parseInt(req.params.page);
        if (page) {
            Product.find()
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .exec(function (err, products) {
                    if (err) return next(err);
                    Product.count().exec(function (err, count) {
                        if (err) return next(err);
                        res.json({ products: products, pages: count / perPage });

                    });
                });
        } else {
            res.json({ message: "Invalid Params" });
        }

    },
    getProductById: function (req, res, next) {
        getProductById(req, res, function (product) {
            res.json(product);
        });
    },

    //TO Do - get it loading
    renderProductsByCategory: function (req, res, next) {
        getProductsByCategory(req, res, function (products) {
            res.render('category', { products: products });
        });
    },
    syncProductstoElastic: function (req, res, next) {
        syncProductstoElastic(next);
    },
    searchProduct : function (req, res, next) {
        if (req.query.q) {
            Product.search({ query_string: { query: req.query.q } },
                function (err, results) {
                    if (err) return next(err);
                    var data = results.hits.hits.map(function (hit) {
                        return hit;
                    });
                    next(data);
                });
        }
    }

};

let getProductsByCategory = function (req, res, next) {
    Product.find({ category: req.params.id })
        .populate('category')
        .exec(function (err, products) {
            if (err) return next(err);
            next(products);
        });
};

let getProductById = function (req, res, next) {
    Product.findById({ _id: req.params.Id }, function (err, product) {
        if (err) return next(err);
        next(product);
    });
};

let syncProductstoElastic = function (callback) {

    Product.createMapping(function (err, mapping) {
        if (err) {
            console.log("Error creating mapping");
            console.log(err);
            callback(err);
        } else {
            console.log("Mapping created");
            console.log(mapping);
            callback(mapping);
        }
    });

    var stream = Product.synchronize();
    var count = 0;
    stream.on('data', function () {
        count++;
    });
    stream.on('close', function () {
        console.log("Indexed " + count + " documents");
        callback(count);
    });
    stream.on('error', function (err) {
        console.log(err);
    });
};