"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (mongoUri) => {
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(mongoUri);
        console.log('1MinuteQuiz Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
