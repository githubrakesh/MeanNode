"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let reviewSchema = new Schema({
    review: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'Cop' },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        require: true
    },
    createdOn: {
        type: Date,
        default: Date.Now
    }
});
module.exports = mongoose.model('Review', reviewSchema);