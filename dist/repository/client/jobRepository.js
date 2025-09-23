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
exports.JobRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobModel_1 = __importDefault(require("../../models/client/jobModel"));
const baseRepository_1 = require("../base/baseRepository");
class JobRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(jobModel_1.default);
    }
    createJob(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = new jobModel_1.default(jobData);
            return yield this.create(job);
        });
    }
    ;
    getJobs() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 4, search = '', filter = '', sort = '') {
            const query = { status: "Open" };
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            if (filter) {
                query.experienceLevel = filter;
            }
            const skip = (page - 1) * limit;
            let sortObj = { createdAt: -1 };
            if (sort) {
                switch (sort) {
                    case 'budgetHigh':
                        sortObj = { rate: -1 };
                        break;
                    case 'budgetLow':
                        sortObj = { rate: 1 };
                        break;
                    case 'dateNew':
                        sortObj = { createdAt: -1 };
                        break;
                    case 'dateOld':
                        sortObj = { createdAt: 1 };
                        break;
                }
            }
            const total = yield this.model.countDocuments(query);
            const jobs = yield this.model.find(query)
                .populate("category", "name")
                .populate("skills", "name")
                .populate("clientId", "name email")
                .populate("hiredFreelancer", "name email")
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .exec();
            return { jobs, total };
        });
    }
    getJobById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this.model.findById(jobId)
                .populate("category", "name")
                .populate("skills", "name")
                .populate("clientId", "name")
                .populate({
                path: "hiredFreelancer",
                populate: { path: "userId", select: "name email" }
            })
                .exec();
            return job;
        });
    }
    ;
    updateJob(jobId, jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedJob = yield this.model.findByIdAndUpdate(jobId, { $set: jobData }, { new: true, runValidators: true })
                .populate("category", "name")
                .populate("skills", "name")
                .populate("clientId", "name email")
                .populate("hiredFreelancer", "name email");
            if (!updatedJob) {
                throw new Error("Job not found");
            }
            return updatedJob;
        });
    }
    ;
    getJobsByClientId(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 4, search = '', filter = '', sort = '') {
            const query = {
                clientId: new mongoose_1.default.Types.ObjectId(userId)
            };
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            if (filter) {
                query.experienceLevel = filter;
            }
            const skip = (page - 1) * limit;
            let sortObj = { createdAt: -1 };
            if (sort) {
                switch (sort) {
                    case 'budgetHigh':
                        sortObj = { rate: -1 };
                        break;
                    case 'budgetLow':
                        sortObj = { rate: 1 };
                        break;
                    case 'dateNew':
                        sortObj = { createdAt: -1 };
                        break;
                    case 'dateOld':
                        sortObj = { createdAt: 1 };
                        break;
                }
            }
            const total = yield this.model.countDocuments(query);
            const jobs = yield this.model.find(query)
                .populate("category", "name")
                .populate("skills", "name")
                .populate("hiredFreelancer", "name email")
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .exec();
            return { jobs, total };
        });
    }
    incrementApplicants(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ _id: new mongoose_1.default.Types.ObjectId(jobId) }, { $inc: { applicants: 1 } });
        });
    }
    decrementApplicants(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ _id: new mongoose_1.default.Types.ObjectId(jobId) }, { $inc: { applicants: -1 } });
        });
    }
}
exports.JobRepository = JobRepository;
;
