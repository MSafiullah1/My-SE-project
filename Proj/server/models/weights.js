const mongoose = require('mongoose');

// I have 7 KPIs, so I need 7 weights. There will be one set of weights given by ML, and one set of weights given by the admin.
// const featureNames = ['task_completion_rate', 'attendance_rate', 'punctuality', 'efficiency', 'professionalism', 'collaboration', 'leadership'];


const weightsSchema = new mongoose.Schema({
    weightsID: {
        type: Number,
        unique: true
    },
    task_completion_rate: Number,
    attendance_rate: Number,
    punctuality: Number,
    efficiency: Number,
    professionalism: Number,
    collaboration: Number,
    leadership: Number
});

const WeightsModel = mongoose.model('Weights', weightsSchema)

module.exports = WeightsModel;