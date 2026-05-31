const mongoose = require('mongoose');

const userFeedbackSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userName:{
        type: String,
    },
    feedbackText:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    }
});

// Create a model from the schema
const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema);

// Export the model
module.exports = UserFeedback;