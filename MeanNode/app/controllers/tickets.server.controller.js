/*jslint node: true */

"use strict";
let Ticket = require('mongoose').model('Ticket');

exports.list = function (req, res, next) {
    Ticket.find({}, function (err, tickets) {
        if (err) {
            return next(err);
        } else {
            next(res.json(tickets));
        }
    });
};

exports.ticketByID = function (req, res, next, id) {
    Ticket.findOne({
        _id: id
    }, function (err, ticket) {
        if (err) {
            return next(err);
        }
        else {
            req.ticket = ticket;
            next();
        }
    });
};

exports.update = function (req, res, next) {
    Ticket.findByIdAndUpdate(req.ticket.id, req.body, function (err, ticket) {
        if (err) {
            return next(err);
        }
        else {
            res.json(ticket);
        }
    });
};

exports.delete = function (req, res, next) {
    req.ticket.remove(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.ticket);
        }
    });
};

exports.create = function (req, res, next) {
    var ticket = new Ticket(req.body);    
    ticket.save(function (err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(ticket);
        }
    });
};

exports.read = function (req, res) {
    res.json(req.ticket);
};