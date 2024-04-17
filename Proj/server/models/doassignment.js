const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const doAssignmentSchema = new Schema({
  assignmentID: {
    type: String,
    unique: true
  },

  employeeID: {
    type: String,
    required: true,
    trim: true
  },
  positionTitle: {
    type: String,
    required: true,
    trim: true
  },
  // Questions is an array of question schema references
  questions: [{
    type: String,
    required: true,
    trim: true
  }],
  // Answers is an array of strings, assuming that there's one answer per question
  answers: [{
    type: String,
    required: true,
    trim: true
  }],

  employee_answers: [{
    type: String,
    required: true,
    trim: true
  }],
  
  score: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  
  date: Date,
});

const DoAssignment = mongoose.model('DoAssignment', doAssignmentSchema);

module.exports = DoAssignment;