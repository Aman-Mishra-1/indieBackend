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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const statusContstants_1 = require("../../constants/statusContstants");
const messageConstants_1 = require("../../constants/messageConstants");
class ApplicationController {
    constructor(_applicationService) {
        this._applicationService = _applicationService;
    }
    applyForJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const jobId = req.params.jobId;
                const freelancerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!jobId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.JOB_ID_REQUIRED });
                    return;
                }
                if (!freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.FREELANCER_ID_REQUIRED });
                    return;
                }
                const application = yield this._applicationService.applyForJob(jobId, freelancerId);
                res.status(statusContstants_1.HttpStatus.CREATED).json({ message: messageConstants_1.Messages.JOB_APPLICATION_SUCCESS, application });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    cancelApplication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const applicationId = req.params.applicationId;
                const freelancerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!applicationId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.JOB_APPLICATION_REQUIRED });
                    return;
                }
                if (!freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.FREELANCER_ID_REQUIRED });
                    return;
                }
                const result = yield this._applicationService.cancelApplication(applicationId, freelancerId);
                if (result) {
                    res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.JOB_APPLICATION_CANCELLED });
                }
                else {
                    res.status(statusContstants_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ messages: messageConstants_1.Messages.FAILED });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getJobApplicants(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.jobId;
                const clientId = req.params.clientId;
                if (!jobId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.JOB_ID_REQUIRED });
                    return;
                }
                if (!clientId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.ID_REQUIRED });
                    return;
                }
                const applicants = yield this._applicationService.getJobApplicants(jobId, clientId);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    message: `Found ${applicants.length} applicants for this job`,
                    applicants
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getFreelancerApplication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const freelancerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.USER_NOT_FOUND });
                    return;
                }
                const applications = yield this._applicationService.getFreelancerApplications(freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({ applications });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getJobApplicationDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.jobId;
                const freelancerId = req.params.freelancerId;
                if (!jobId || !freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                const application = yield this._applicationService.getApplicationDetail(jobId, freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({ application });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
exports.ApplicationController = ApplicationController;
;
