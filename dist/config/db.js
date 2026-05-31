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
const mongoose = require('mongoose');
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose
            .connect(process.env.MONGODB_CONNECTION_STRING_URI || 'mongodb://localhost:27017/CVgenerator', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => (console.log("1MinuteQuiz Database connected with cloud")))
            .catch((err) => (console.log("Not conneted with database.")));
    }
    catch (err) {
        console.error(`Database connection error: ${err.message}`);
        process.exit(1);
    }
});
module.exports = connectDB;
