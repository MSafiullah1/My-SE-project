const mongoose = require('mongoose')

const HR_AdminSchema = new mongoose.Schema({
    adminID: {
        type: String,
        unique: true
    },
    name: String,
    email: String,
    password: String,
    profile_picture: String,
    gender: String,
    contactNumber: String,
    two_factor_answer: Number
});

const HR_AdminModel = mongoose.model('HR_Admin', HR_AdminSchema)

module.exports = HR_AdminModel;