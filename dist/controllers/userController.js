"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.signupDefault = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const ApiError_1 = require("../utils/ApiError");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError_1.ApiError(400, 'Email and password are required.');
        }
        const user = await userSchema_1.default.findOne({ email });
        if (!user) {
            throw new ApiError_1.ApiError(401, 'Invalid credentials');
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            throw new ApiError_1.ApiError(401, 'Invalid credentials');
        }
        const token = user.generateToken();
        user.tokens.push({ token });
        await user.save();
        res.cookie('userCookie', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60,
        });
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Login successful',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const signupDefault = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { message: 'Welcome to register page.' },
    });
};
exports.signupDefault = signupDefault;
const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new ApiError_1.ApiError(400, 'All fields are required.');
        }
        const existingUser = await userSchema_1.default.findOne({ email });
        if (existingUser) {
            throw new ApiError_1.ApiError(400, 'Email already exists.');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new userSchema_1.default({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            status: 'success',
            data: { message: 'User registered successfully.' },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
