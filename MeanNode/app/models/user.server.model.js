/*jslint node: true */

"use strict";
const mongoose = require('mongoose');
const crypto = require('crypto');
let Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: { type: String, index: true, lowercase: true, unique: true },
    username: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String
    },
    provider: String,
    providerId: String,
    providerData: {},
    role: {
        type: String,
        enum: ['Member', 'Client', 'Owner', 'Admin'],
        default: 'Member'
    },
    token: String
});

UserSchema.pre('save',
    function (next) {
        if (this.password) {
            var md5 = crypto.createHash('md5');
            this.password = md5.update(this.password).digest('hex');
        }
        next();
    }
);

UserSchema.methods.authenticate = function (password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne(
        { username: possibleUsername },
        function (err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                }
                else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};
module.exports = mongoose.model('User', UserSchema);