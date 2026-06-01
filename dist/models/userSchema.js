"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = require("../config/validateEnv");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    registrationDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
userSchema.methods.generateToken = function () {
    const signOptions = { expiresIn: validateEnv_1.env.JWT_EXPIRATION };
    const secretKey = validateEnv_1.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign({
        _id: this._id.toString(),
        role: this.role,
        email: this.email,
    }, secretKey, signOptions);
};
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.default = exports.User;
