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
exports.ApplicationService = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
const mongoose_1 = __importDefault(require("mongoose"));
class ApplicationService {
    constructor(_applicationRepository, _jobRepository) {
        this._applicationRepository = _applicationRepository;
        this._jobRepository = _jobRepository;
    }
    applyForJob(jobId, freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this._jobRepository.getJobById(jobId);
            if (!job) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.JOB_NOT_FOUND);
            }
            ;
            if (job.status !== "Open") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.JOB_CLOSED);
            }
            const existingApplication = yield this._applicationRepository.getApplicationByJobAndFreelancer(jobId, freelancerId);
            if (existingApplication) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.CONFLICT, messageConstants_1.Messages.ALREADY_APPLIED);
            }
            const application = {
                jobId: new mongoose_1.default.Types.ObjectId(jobId),
                freelancerId: new mongoose_1.default.Types.ObjectId(freelancerId),
                isApplied: true,
                status: "Pending"
            };
            const newApplication = yield this._applicationRepository.createApplication(application);
            yield this._jobRepository.incrementApplicants(jobId);
            return newApplication;
        });
    }
    ;
    cancelApplication(applicationId, freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield this._applicationRepository.findId(applicationId);
            if (!application) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.JOB_APPLICATION_REQUIRED);
            }
            if (application.freelancerId.toString() !== freelancerId) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.ACCESS_DENIED);
            }
            const result = yield this._applicationRepository.deleteApplication(applicationId);
            if (result) {
                yield this._jobRepository.decrementApplicants(application.jobId.toString());
            }
            return result;
        });
    }
    ;
    getJobApplicants(jobId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this._jobRepository.getJobById(jobId);
            if (!job) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.JOB_NOT_FOUND);
            }
            if (job.clientId._id.toString() !== clientId) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.ACCESS_DENIED);
            }
            return yield this._applicationRepository.getApplicationsByJobId(jobId);
        });
    }
    ;
    getFreelancerApplications(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._applicationRepository.getApplicationsByFreelancer(freelancerId);
        });
    }
    ;
    getApplicationDetail(jobId, freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._applicationRepository.findOne({ jobId, freelancerId });
        });
    }
}
exports.ApplicationService = ApplicationService;
;
