const tickets = require('../../app/controllers/tickets.server.controller');

module.exports = function (app) {
    app.route('/api/v1/tickets')
        .post(tickets.create)
        .get(tickets.list);
    
    app.route('/api/v1/tickets/:ticketId')
        .get(tickets.read)
        .put(tickets.update)
        .delete(tickets.delete);
    app.param('ticketId', tickets.ticketByID);
};