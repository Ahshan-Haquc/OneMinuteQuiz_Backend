"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFeedback = void 0;
const mongoose_1 = require("mongoose");
const userFeedbackSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    feedbackText: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.UserFeedback = (0, mongoose_1.model)('UserFeedback', userFeedbackSchema);
exports.default = exports.UserFeedback;
