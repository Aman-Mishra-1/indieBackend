"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileRoute_1 = __importDefault(require("./profileRoute"));
const jobRoutes_1 = __importDefault(require("./jobRoutes"));
const applicantsRoutes_1 = __importDefault(require("./applicantsRoutes"));
const contractRoutes_1 = __importDefault(require("./contractRoutes"));
const reviewRoutes_1 = __importDefault(require("./reviewRoutes"));
const router = express_1.default.Router();
router.use('/profile', profileRoute_1.default);
router.use('/job', jobRoutes_1.default);
router.use('/job/applicants', applicantsRoutes_1.default);
router.use('/contract/', contractRoutes_1.default);
router.use('/review/', reviewRoutes_1.default);
exports.default = router;
