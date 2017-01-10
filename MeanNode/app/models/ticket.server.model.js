/*jslint node: true */

"use strict";
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TicketSchema = new Schema({
    title: String,
    assigne: {
        type: String
    },
    status: {
        type: Number
    },
    comment: String
});

mongoose.model('Ticket', TicketSchema);