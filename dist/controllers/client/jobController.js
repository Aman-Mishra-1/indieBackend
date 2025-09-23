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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const statusContstants_1 = require("../../constants/statusContstants");
const messageConstants_1 = require("../../constants/messageConstants");
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("../../config/env.config");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(env_config_1.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia"
});
class JobController {
    constructor(_jobService) {
        this._jobService = _jobService;
    }
    createJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const jobData = req.body;
                if (!userId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.USER_NOT_FOUND });
                    return;
                }
                const addedJob = yield this._jobService.addJob(userId, jobData);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.JOB_UPDATED, job: addedJob });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getJobs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 4;
                const search = req.query.search || '';
                const filter = req.query.filter || '';
                const sort = req.query.sort || '';
                const { jobs, total } = yield this._jobService.getJobs(page, limit, search, filter, sort);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    jobs,
                    total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getJobById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                if (!jobId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.JOB_NOT_FOUND });
                    return;
                }
                const job = yield this._jobService.getJobById(jobId);
                if (!job) {
                    res.status(statusContstants_1.HttpStatus.NOT_FOUND).json({ message: messageConstants_1.Messages.JOB_NOT_FOUND });
                    return;
                }
                res.status(statusContstants_1.HttpStatus.OK).json({ data: job });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    updateJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const jobId = req.params.id;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const jobData = req.body;
                if (!jobId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.JOB_NOT_FOUND });
                    return;
                }
                const existingJob = yield this._jobService.getJobById(jobId);
                if (!existingJob) {
                    res.status(statusContstants_1.HttpStatus.FORBIDDEN).json({ message: messageConstants_1.Messages.ACCESS_DENIED });
                    return;
                }
                if (existingJob.clientId._id.toString() !== userId) {
                    res.status(statusContstants_1.HttpStatus.FORBIDDEN).json({ message: messageConstants_1.Messages.ACCESS_DENIED });
                    return;
                }
                const updatedJob = yield this._jobService.updateJob(jobId, jobData);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.JOB_UPDATED, job: updatedJob });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getClientJobs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 4;
                const search = req.query.search || '';
                const filter = req.query.filter || '';
                const sort = req.query.sort || '';
                if (!userId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.USER_NOT_FOUND });
                    return;
                }
                const { jobs, total } = yield this._jobService.getJobsByClientId(userId, page, limit, search, filter, sort);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    jobs,
                    total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    stripePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { jobId } = req.params;
                const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { title, rate, freelancerId } = req.body;
                console.log("Client ID:", clientId);
                console.log("Job ID:", jobId);
                console.log("Title:", title);
                console.log("Price:", rate);
                console.log("Freelancer ID:", freelancerId);
                if (!clientId) {
                    res.status(statusContstants_1.HttpStatus.UNAUTHORIZED).json({ message: "Client not found" });
                    return;
                }
                if (!freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: "Freelancer ID is required" });
                    return;
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(jobId)) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.INVALID_ID });
                    return;
                }
                const job = yield this._jobService.getJobById(jobId);
                if (!job) {
                    res.status(statusContstants_1.HttpStatus.NOT_FOUND).json({ message: messageConstants_1.Messages.JOB_NOT_FOUND });
                    return;
                }
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price_data: {
                                currency: "inr",
                                product_data: {
                                    name: title
                                },
                                unit_amount: Math.round(rate * 100)
                            },
                            quantity: 1,
                        },
                    ],
                    mode: "payment",
                    success_url: `${env_config_1.env.CLIENT_URL}/client/contract/payment-success`,
                    cancel_url: `${env_config_1.env.CLIENT_URL}/client/jobs/home?cancelled=true`,
                    metadata: {
                        jobId: jobId,
                        clientId: clientId,
                        freelancerId: freelancerId
                    },
                });
                console.log('✅ STRIPE SESSION CREATED');
                res.json({ id: session.id });
            }
            catch (error) {
                console.log('❌ Stripe payment error: ', error);
                next(error);
            }
        });
    }
    ;
}
exports.JobController = JobController;
