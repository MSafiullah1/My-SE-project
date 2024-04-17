const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedbackID: {
        type: String,
        unique: true
    },
    courseID: String,
    rating: Number,
    employeeID: String,
    feedback: String,
    date: Date,
});

const FeedbackModel = mongoose.model('Feedback', feedbackSchema)

module.exports = FeedbackModel;