"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRating = exports.updateTotalPlayCount = exports.updateHighestScore = exports.getTopThreeHighestScores = exports.getLandingPageData = void 0;
const quizTrackingSchema_1 = __importDefault(require("../models/quizTrackingSchema"));
const ApiError_1 = require("../utils/ApiError");
const getLandingPageData = async (req, res) => {
    try {
        const existingData = await quizTrackingSchema_1.default.findOne();
        if (!existingData) {
            await quizTrackingSchema_1.default.create({});
            console.log("Quiz tracking document created.");
        }
        const quizData = await quizTrackingSchema_1.default.findOne();
        res.status(200).json({
            status: 'success',
            message: 'Landing page data retrieved successfully.',
            data: quizData
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};
exports.getLandingPageData = getLandingPageData;
const getTopThreeHighestScores = async (req, res) => {
};
exports.getTopThreeHighestScores = getTopThreeHighestScores;
const updateHighestScore = async (req, res) => {
    const { quizName } = req.params;
    const { score } = req.body;
    if (!quizName) {
        throw new ApiError_1.ApiError(400, 'Quiz name is required.');
    }
    if (!score) {
        throw new ApiError_1.ApiError(400, 'Score is required.');
    }
    const quiz = await quizTrackingSchema_1.default.findOne();
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found.');
    }
    const previousTopThreeScores = quiz.get(`${quizName}TopThreeScores`) || { first: 0, second: 0, third: 0 };
    let newTopThreeScores = previousTopThreeScores;
    if (score > previousTopThreeScores.first) {
        newTopThreeScores.third = previousTopThreeScores.second;
        newTopThreeScores.second = previousTopThreeScores.first;
        newTopThreeScores.first = score;
    }
    else if (score > previousTopThreeScores.second) {
        newTopThreeScores.third = previousTopThreeScores.second;
        newTopThreeScores.second = score;
    }
    else if (score > previousTopThreeScores.third) {
        newTopThreeScores.third = score;
    }
    const fieldName = `${quizName}TopThreeScores`;
    const data = await quizTrackingSchema_1.default.findOneAndUpdate({}, { $set: { [fieldName]: newTopThreeScores } }, { new: true });
    res.status(200).json({
        status: 'success',
        message: 'Scores updated successfully.',
    });
};
exports.updateHighestScore = updateHighestScore;
const updateTotalPlayCount = async (req, res) => {
    const { quizName } = req.params;
    if (!quizName) {
        throw new ApiError_1.ApiError(400, 'Quiz name is required.');
    }
    let convertedName = '';
    for (let i = 0; i < quizName.length; i++) {
        if (i === 0) {
            convertedName += quizName[i].toUpperCase();
        }
        else {
            convertedName += quizName[i];
        }
    }
    const quizNameField = `total${convertedName}GamePlayed`;
    await quizTrackingSchema_1.default.findOneAndUpdate({}, { $inc: { [quizNameField]: 1 } }, { new: true });
    res.status(200).json({
        status: 'success',
        message: 'Total play count updated successfully.',
    });
};
exports.updateTotalPlayCount = updateTotalPlayCount;
const updateRating = async (req, res) => {
    const { quizName } = req.params;
    const { rating } = req.body;
    if (!quizName) {
        throw new ApiError_1.ApiError(400, 'Quiz name is required.');
    }
    if (!rating) {
        throw new ApiError_1.ApiError(400, 'Rating is required.');
    }
    const quizNameField = `total${quizName}GameRating`;
    const quiz = await quizTrackingSchema_1.default.findOne();
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found.');
    }
    const previousRating = quizName === 'GuessTheWord' ? quiz.totalGuessTheWordGameRating : quizName === 'QuickCalculate' ? quiz.totalQuickCalculateGameRating : quizName === 'MemoryFlash' ? quiz.totalMemoryFlashGameRating : quiz.totalTargetClickerGameRating;
    const newRating = (previousRating + rating) / 2;
    await quizTrackingSchema_1.default.findOneAndUpdate({}, { [quizNameField]: newRating }, { new: true });
    res.status(200).json({
        status: 'success',
        message: 'Thanks for your rating.',
    });
};
exports.updateRating = updateRating;
