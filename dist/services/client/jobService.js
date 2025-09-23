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
exports.JobService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
class JobService {
    constructor(_jobRepository) {
        this._jobRepository = _jobRepository;
    }
    addJob(userId, jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jobData.title || !jobData.description || !jobData.rate ||
                !jobData.experienceLevel || !jobData.location || !jobData.category ||
                !jobData.skills || jobData.skills.length === 0) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.CONFLICT, messageConstants_1.Messages.REQUIRED_ALL);
            }
            if (jobData.startDate && jobData.endDate && jobData.endDate < jobData.startDate) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.INVALID_DATE_RANGE);
            }
            if (jobData.startDate) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startDate = new Date(jobData.startDate);
                startDate.setHours(0, 0, 0, 0);
                if (startDate < today) {
                    throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.INVALID_START_DATE);
                }
            }
            jobData.clientId = new mongoose_1.default.Types.ObjectId(userId);
            jobData.applicants = 0;
            jobData.status = "Open";
            const newJob = yield this._jobRepository.createJob(jobData);
            return newJob;
        });
    }
    ;
    getJobs(page, limit, search, filter, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._jobRepository.getJobs(page, limit, search, filter, sort);
        });
    }
    getJobById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.isValidObjectId(jobId)) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.INVALID_ID);
            }
            return this._jobRepository.getJobById(jobId);
        });
    }
    ;
    updateJob(jobId, jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.isValidObjectId(jobId)) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.INVALID_ID);
            }
            const existingJob = yield this._jobRepository.getJobById(jobId);
            if (!existingJob) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.JOB_NOT_FOUND);
            }
            if (jobData.title === "") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.JOB_TITLE_REQUIRED);
            }
            if (jobData.description === "") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.JOB_DESCRIPTION_REQUIRED);
            }
            if (jobData.rate !== undefined && jobData.rate < 0) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.JOB_RATE_LIMIT);
            }
            if (jobData.startDate && jobData.endDate && jobData.endDate < jobData.startDate) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.INVALID_DATE_RANGE);
            }
            if (jobData.startDate) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startDate = new Date(jobData.startDate);
                startDate.setHours(0, 0, 0, 0);
                if (startDate < today) {
                    throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.INVALID_START_DATE);
                }
            }
            if (existingJob.applicants > 0) {
                const allowedUpdates = ['title', 'description', 'status'];
                const safeUpdates = {};
                for (const field of allowedUpdates) {
                    if (field in jobData) {
                        safeUpdates[field] = jobData[field];
                    }
                }
                return this._jobRepository.updateJob(jobId, safeUpdates);
            }
            return this._jobRepository.updateJob(jobId, jobData);
        });
    }
    ;
    getJobsByClientId(userId, page, limit, search, filter, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.isValidObjectId(userId)) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.INVALID_ID);
            }
            return this._jobRepository.getJobsByClientId(userId, page, limit, search, filter, sort);
        });
    }
}
exports.JobService = JobService;
;
