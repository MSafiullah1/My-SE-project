const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const assessmentQuestionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const assessmentSchema = new Schema({
    positionIDnew: {
        type: String,
        unique: true
    },
    questions: [assessmentQuestionSchema]
});


const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
