"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverallTracking = void 0;
const mongoose_1 = require("mongoose");
const overallTrackingSchema = new mongoose_1.Schema({
    totalQuessTheWordGamePlayed: {
        type: Number,
        default: 0,
    },
    totalQuickCalculateGamePlayed: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 1,
        max: 5,
    },
}, { timestamps: true });
exports.OverallTracking = (0, mongoose_1.model)('OverallTracking', overallTrackingSchema);
exports.default = exports.OverallTracking;
