"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileRoutes_1 = __importDefault(require("../../routes/freelancer/profileRoutes"));
const appliedRoutes_1 = __importDefault(require("../freelancer/appliedRoutes"));
const contractRoutes_1 = __importDefault(require("./contractRoutes"));
const walletRoutes_1 = __importDefault(require("./walletRoutes"));
const router = express_1.default.Router();
router.use('/profile', profileRoutes_1.default);
router.use('/jobs', appliedRoutes_1.default);
router.use('/contract', contractRoutes_1.default);
router.use('/wallet', walletRoutes_1.default);
exports.default = router;
