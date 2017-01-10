/*jslint node: true */

"use strict";

const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");
const config = require('../../config/config');

let Schema = mongoose.Schema;
let ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category', es_indexed: false },
    name: { type: String, es_indexed: true }, //specify if needs to be indexed by elastic
    price: { type: Number, es_indexed: true },
    image: { type: String },  //specify if needs to be indexed by elastic
});

ProductSchema.plugin(mongoosastic, {
    host: config.elasticsearch.host,
    port: config.elasticsearch.port,
    protocol: config.elasticsearch.protocol,
    auth: config.elasticsearch.auth
});

mongoose.model('Product', ProductSchema);