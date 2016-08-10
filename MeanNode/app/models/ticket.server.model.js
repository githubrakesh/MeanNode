var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;


var TicketSchema = new Schema({
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