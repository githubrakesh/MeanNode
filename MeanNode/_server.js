process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport'),
    
    https = require('https'),
    fs = require('fs');

var db = mongoose(),
    passport = passport(),
    app = express();


/*Create a https server and listen
var options = {
    key: fs.readFileSync('./config/keys/rakzdev-key.pem'),
    cert: fs.readFileSync('./config/keys/rakzdev-cert.pem')
}
var httpsServer = https.createServer(options, app);
httpsServer.listen(config.httpsport);
console.log('Https' + process.env.NODE_ENV + ' server running at http://localhost:' + config.httpsport)
*/


//Listen to http traffic
app.listen(config.port);
console.log('http ' + process.env.NODE_ENV + ' server running at http://localhost:' + config.port);

module.exports = app;