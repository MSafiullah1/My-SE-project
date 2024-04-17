const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        unique: true
    },
    name: String,
    // email : String,
    email: String,
    password: String,
    contactNumber: String,
    date_of_birth: Date,
    gender: String,
    positionID: String,
    skills: [String],
    security_question: String,
    security_answer: String,
    two_factor_answer: Number,
    mentor_ID: String,
    task_completion_rate: Number,
    attendance_rate: Number,

    punctuality: Number,
    efficiency: Number,
    professionalism: Number,
    collaboration: Number,
    leadership: Number,

    job_history: [String],
    education: [String],
    certifications: [String],
    awards: [String],
    workshops_taken: [String],
    courses_taken: [String],
    assessement_results: [String],
    profile_picture: String,
    registered_status: Boolean,
    about: String,

    about_me: String,
    is_blocked: Boolean,
    failed_attempts: Number,
});

const EmployeeModel = mongoose.model('Employee', employeeSchema)

module.exports = EmployeeModel;