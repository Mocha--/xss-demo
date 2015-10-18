/**
 * backend/app/model/seller.js
 */

'use strict'

// ============================
// call packages
// ============================
var mongoose = require("mongoose")

// ============================
// schema
// ============================
var sellerSchema = new mongoose.Schema({
    username: {
        type: 'String',
        required: true
    },

    password: {
        type: 'String',
        required: true
    }
})

module.exports = mongoose.model("User", sellerSchema)
