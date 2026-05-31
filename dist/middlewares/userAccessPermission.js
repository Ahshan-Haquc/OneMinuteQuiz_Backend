"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require('jsonwebtoken');
const Model = require('../models/userSchema');
const userAccessPermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookieToken = req.cookies.userCookie;
        if (!cookieToken) {
            console.log("No token in cookies");
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const validUser = jwt.verify(cookieToken, process.env.JWT_SECRET);
        const user = yield Model.findOne({ _id: validUser._id });
        if (!user) {
            console.log("User not found with token");
            return res.status(401).json({ error: "Unauthorized access" });
        }
        req.token = cookieToken;
        req.userInfo = user;
        next();
    }
    catch (error) {
        console.log("JWT error:", error.message);
        req.unAuthenticateUser = true;
        return res.status(401).json({ error: "Unauthorized access" });
    }
});
module.exports = userAccessPermission;
