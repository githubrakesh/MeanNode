
"use strict";
const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let locationSchema = new Schema({
    type: { $type: String },
    address: { $type: String },
    coordinates: [Number]
}, { typeKey: '$type' });


let copSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        index: true
    },
    displayName: { type: String },
    displayPhoto: { type: String },
    phone: { type: String },
    email: { type: String },
    calculatedRating: {
        type: Number,
        min: 0,
        max: 5
    },
    location: { type: locationSchema }
});
locationSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Cop', copSchema);