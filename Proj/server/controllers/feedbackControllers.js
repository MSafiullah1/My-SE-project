
const User = require('../models/users')
const Employee = require('../models/employee')
const Position = require('../models/positions')
const Course = require('../models/course')
const Workshop = require('../models/workshop')
const HR_Admin = require('../models/hr_admin')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')

const FeedbackModel = require('../models/feedback')
const ComplaintModel = require('../models/complaint')
const AssessmentModel = require('../models/doassignment')

const viewFeedbacks = async (reqs, resp) => {
    try {
        const feedbacks = await FeedbackModel.find()
        return resp.json(feedbacks)
    } catch (error) {
        console.log(error)
    }
}

const viewComplaints = async (reqs, resp) => {
    try {
        const complaints = await ComplaintModel.find()
        return resp.json(complaints)
    } catch (error) {
        console.log(error)
    }
}

const viewAssignments = async (reqs, resp) => {
    try {
        const assignments = await AssessmentModel.find()
        return resp.json(assignments)
    } catch (error) {
        console.log(error)
    }
}




module.exports = {
    viewFeedbacks,
    viewComplaints,
    viewAssignments
}


