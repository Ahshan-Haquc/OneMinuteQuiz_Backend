"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizTracking = void 0;
const mongoose_1 = require("mongoose");
const quizTrackingSchema = new mongoose_1.Schema({
    totalGuessTheWordGamePlayed: {
        type: Number,
        default: 0,
    },
    totalQuickCalculateGamePlayed: {
        type: Number,
        default: 0,
    },
    totalMemoryFlashGamePlayed: {
        type: Number,
        default: 0,
    },
    totalTargetClickerGamePlayed: {
        type: Number,
        default: 0,
    },
    totalGuessTheWordGameRating: {
        type: Number,
        default: 5,
    },
    totalQuickCalculateGameRating: {
        type: Number,
        default: 5,
    },
    totalMemoryFlashGameRating: {
        type: Number,
        default: 5,
    },
    totalTargetClickerGameRating: {
        type: Number,
        default: 5,
    },
    guessTheWordTopThreeScores: {
        first: { type: Number, default: 0 },
        second: { type: Number, default: 0 },
        third: { type: Number, default: 0 },
    },
    quickCalculateTopThreeScores: {
        first: { type: Number, default: 0 },
        second: { type: Number, default: 0 },
        third: { type: Number, default: 0 },
    },
    memoryFlashTopThreeScores: {
        first: { type: Number, default: 0 },
        second: { type: Number, default: 0 },
        third: { type: Number, default: 0 },
    },
    targetClickerTopThreeScores: {
        first: { type: Number, default: 0 },
        second: { type: Number, default: 0 },
        third: { type: Number, default: 0 },
    },
    averageRating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.QuizTracking = (0, mongoose_1.model)('QuizTracking', quizTrackingSchema);
exports.default = exports.QuizTracking;
