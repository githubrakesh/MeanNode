/*jslint node: true */

"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let CategorySchema = new Schema({
    name: { type: String, unique: true, lowercase: true }
});

mongoose.model('Category', CategorySchema);