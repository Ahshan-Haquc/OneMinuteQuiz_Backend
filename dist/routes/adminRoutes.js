"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../utils/catchAsync");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.get('/loadAdminDashboardValues', (0, catchAsync_1.catchAsync)(adminController_1.loadAdminDashboardValues));
router.post('/deleteUser', (0, catchAsync_1.catchAsync)(adminController_1.deleteUser));
exports.default = router;
