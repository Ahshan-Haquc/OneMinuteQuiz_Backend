const mongoose = require('mongoose');

const OverallTrackingSchema = new mongoose.Schema({
    totalQuessTheWordGamePlayed: {
        type: Number,
        default: 0
    },
    totalQuickCalculateGamePlayed: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 1,
        max:5
    }});

    const OverallTracking = mongoose.model('OverallTrackingSchema', adminControlSchema);

// Export the model
module.exports = OverallTracking;