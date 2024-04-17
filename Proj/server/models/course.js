const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseID: {
        type: String,
        unique: true
    },
    title: String,
    start_date: Date,
    duration: Number, // in days
    description: String
});

const CourseModel = mongoose.model('Course', courseSchema)

module.exports = CourseModel;