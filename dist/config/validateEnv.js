"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.validateEnv = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnv = ['JWT_SECRET', 'MONGODB_CONNECTION_STRING_URI'];
const missingEnvError = (key) => {
    throw new Error(`Missing required environment variable: ${key}`);
};
const validateEnv = () => {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    const port = Number(process.env.PORT ?? 3000);
    const jwtSecret = process.env.JWT_SECRET ?? missingEnvError('JWT_SECRET');
    const jwtExpiration = process.env.JWT_EXPIRATION ?? '1h';
    const mongoUri = process.env.MONGODB_CONNECTION_STRING_URI ?? missingEnvError('MONGODB_CONNECTION_STRING_URI');
    if (Number.isNaN(port) || port <= 0) {
        throw new Error('PORT must be a positive number');
    }
    return {
        NODE_ENV: nodeEnv,
        PORT: port,
        JWT_SECRET: jwtSecret,
        JWT_EXPIRATION: jwtExpiration,
        MONGODB_CONNECTION_STRING_URI: mongoUri,
    };
};
exports.validateEnv = validateEnv;
exports.env = (0, exports.validateEnv)();
