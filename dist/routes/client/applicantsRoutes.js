"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applicationRepository_1 = require("../../repository/client/applicationRepository");
const jobRepository_1 = require("../../repository/client/jobRepository");
const applicationService_1 = require("../../services/client/applicationService");
const applicationController_1 = require("../../controllers/client/applicationController");
const router = express_1.default.Router();
const applicationRepsitory = new applicationRepository_1.ApplicationRepository();
const jobRepository = new jobRepository_1.JobRepository();
const applicationService = new applicationService_1.ApplicationService(applicationRepsitory, jobRepository);
const applicationController = new applicationController_1.ApplicationController(applicationService);
router.get("/:jobId/:clientId", applicationController.getJobApplicants.bind(applicationController));
exports.default = router;
