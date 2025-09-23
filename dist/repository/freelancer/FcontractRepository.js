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
exports.FreelancerContractRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contractModel_1 = __importDefault(require("../../models/client/contractModel"));
const baseRepository_1 = require("../base/baseRepository");
class FreelancerContractRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(contractModel_1.default);
    }
    getContractById(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({
                _id: new mongoose_1.default.Types.ObjectId(contractId),
                isDeleted: false
            });
        });
    }
    ;
    getContractsByFreelancer(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({
                freelancerId: new mongoose_1.default.Types.ObjectId(freelancerId),
                isDeleted: false
            })
                .populate('jobId')
                .populate('clientId', 'name email profilePic')
                .sort({ createdAt: -1 })
                .lean();
        });
    }
    ;
    getContractByJobId(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({
                jobId: new mongoose_1.default.Types.ObjectId(jobId),
                isDeleted: false
            });
        });
    }
    ;
    updateContract(contractId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(contractId), isDeleted: false }, updateData, { new: true });
        });
    }
    getCompletedContractsByFreelancer(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({
                freelancerId,
                status: "Completed",
                isDeleted: false
            }).populate([
                { path: "jobId", select: "title description rate" },
                { path: "clientId", select: "name email profilePic" },
            ]);
        });
    }
    ;
}
exports.FreelancerContractRepository = FreelancerContractRepository;
;
