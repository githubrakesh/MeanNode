/*jslint node: true */
"use strict";
const config = require('./config');
const winston = require('winston');
winston.emitErrs = true; // Notice :- a `const` object can have properties mutated
const tsFormat = () => (new Date()).toLocaleString(); // Notice:    Arrow function syntax:  A function with no parameters requires parentheses:
//() => { statements }
//() => expression // equivalent to: () => { return expression; }
// 
module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: config.winston.consoleLevel,
            handleExceptions: true,
            timestamp: tsFormat,
            json: false,
            colorize: true
        }),
        new (winston.transports.File)({
            name: config.winston.fileLevel + '-file',
            filename: __dirname + '/' + config.winston.logFile,
            json: false,
            timestamp: tsFormat,
            handleExceptions: true,
            level: config.winston.fileLevel,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({
            json: false,
            timestamp: true
        })
        //new (winston.transports.File)({  handleExceptions: true, filename: __dirname + '/exceptions.log', json: false })
    ],

    exitOnError: false
});