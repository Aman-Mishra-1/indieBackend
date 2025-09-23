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
exports.ContractService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
function generateContractId() {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    return `CON${randomDigits}`;
}
class ContractService {
    constructor(_contractRepository, _jobRepository, _applicationRepository) {
        this._contractRepository = _contractRepository;
        this._jobRepository = _jobRepository;
        this._applicationRepository = _applicationRepository;
    }
    createContract(jobId, clientId, freelancerId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this._jobRepository.getJobById(jobId);
            if (!job) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.JOB_NOT_FOUND);
            }
            ;
            if (job.status !== "Open") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.JOB_CLOSED);
            }
            ;
            const existingContract = yield this._contractRepository.getContractByJobId(jobId);
            if (existingContract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.CONTRACT_EXIST);
            }
            ;
            const application = yield this._applicationRepository.getApplicationByJobAndFreelancer(jobId, freelancerId);
            if (!application) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.FREELANCER_NOT_APPLIED);
            }
            ;
            const contractData = {
                contractId: generateContractId(),
                jobId: new mongoose_1.default.Types.ObjectId(jobId),
                clientId: new mongoose_1.default.Types.ObjectId(clientId),
                freelancerId: new mongoose_1.default.Types.ObjectId(freelancerId),
                isApproved: false,
                amount,
                escrowPaid: false
            };
            const newContract = yield this._contractRepository.createContract(contractData);
            yield this._jobRepository.updateJob(jobId, {
                hiredFreelancer: new mongoose_1.default.Types.ObjectId(freelancerId),
                status: "Closed"
            });
            return newContract;
        });
    }
    ;
    getClientContracts(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._contractRepository.getContractsByClient(clientId);
        });
    }
    ;
    cancelContract(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._contractRepository.getContractById(contractId);
            if (!contract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CONTRACT_NOT_FOUND);
            }
            yield this._contractRepository.deleteContract(contractId);
            yield this._jobRepository.updateJob(contract.jobId.toString(), {
                hiredFreelancer: null,
                status: "Open"
            });
        });
    }
    ;
    isContractExist(jobId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._contractRepository.findOne({ jobId, clientId, isDeleted: false });
        });
    }
    ;
    getAllContracts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._contractRepository.findAllContracts();
        });
    }
    ;
    requestFundRelease(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._contractRepository.findById(contractId);
            if (!contract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CONTRACT_NOT_FOUND);
            }
            if (contract.status !== "Completed") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.WORK_NOT_COMPLETED);
            }
            contract.releaseFundStatus = "Requested";
            yield contract.save();
            return true;
        });
    }
    ;
    getContractById(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._contractRepository.findById(contractId);
        });
    }
    ;
}
exports.ContractService = ContractService;
