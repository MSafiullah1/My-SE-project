const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    workshopID: {
        type: String,
        unique: true
    },
    title: String,
    date: Date,
    description: String,
});

const WorkshopModel = mongoose.model('Workshop', workshopSchema)

module.exports = WorkshopModel;