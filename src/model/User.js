'use strict'

import mongoose from 'mongoose';
module.exports = function (done) {
    const Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    const User = new Schema({
        name: {type: String, unique: true},
        password: {type: String},
        nikename: {type: String}
    });

    $.mongodb.model('User', User);
    $.model.User = $.mongodb.model('User');
    done();
}