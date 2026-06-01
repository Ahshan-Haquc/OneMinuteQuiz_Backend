"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const validateEnv_1 = require("./config/validateEnv");
const startServer = async () => {
    await (0, db_1.connectDB)(validateEnv_1.env.MONGODB_CONNECTION_STRING_URI);
    const port = validateEnv_1.env.PORT;
    app_1.default.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
