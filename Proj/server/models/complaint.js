const mongoose = require('mongoose');

const complaintScheme = new mongoose.Schema({
    complaintID: {
        type: String,
        unique: true
    },
    employeeID1: String,
    courseID: String,
    employeeID2: String,
    feedback: String,
    date: Date,
});

const ComplaintModel = mongoose.model('Complaint', complaintScheme)

module.exports = ComplaintModel;