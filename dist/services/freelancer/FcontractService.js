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
exports.FreelancerContractService = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
}
;
class FreelancerContractService {
    constructor(_contractRepository) {
        this._contractRepository = _contractRepository;
    }
    approveContract(contractId, freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._contractRepository.getContractById(contractId);
            if (!contract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CONTRACT_NOT_FOUND);
            }
            if (contract.freelancerId.toString() !== freelancerId) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.ACCESS_DENIED);
            }
            const updatedContract = yield this._contractRepository.updateContract(contractId, {
                isApproved: true,
            });
            if (!updatedContract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.INTERNAL_SERVER_ERROR, messageConstants_1.Messages.CONTRACT_STATUS_UPDATE_FAILED);
            }
            return updatedContract;
        });
    }
    ;
    updateContractStatus(contractId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._contractRepository.getContractById(contractId);
            if (!contract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CONTRACT_NOT_FOUND);
            }
            const validTransitions = {
                Pending: ["Started", "Canceled"],
                Started: ["Ongoing", "Canceled"],
                Ongoing: ["Completed", "Canceled"],
                Completed: [],
                Canceled: []
            };
            if (!validTransitions[contract.status].includes(status)) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, `Invalid status transition from ${contract.status} to ${status}`);
            }
            const updateData = {
                status,
                $push: {
                    statusHistory: {
                        status,
                        timestamp: formatDate(new Date())
                    }
                }
            };
            console.log('UPDATED DATA', updateData);
            const updatedContract = yield this._contractRepository.updateContract(contractId, updateData);
            console.log('UPDATED CONTRACT', updatedContract);
            if (!updatedContract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.INTERNAL_SERVER_ERROR, messageConstants_1.Messages.CONTRACT_STATUS_UPDATE_FAILED);
            }
            return updatedContract;
        });
    }
    ;
    getFreelancerContracts(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._contractRepository.getContractsByFreelancer(freelancerId);
        });
    }
    ;
    getContractById(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._contractRepository.findOne({
                _id: contractId,
                isDeleted: false
            });
            if (!contract)
                return null;
            return yield contract.populate([
                { path: "jobId", select: "title description rate" },
                { path: "clientId", select: "name email profilePic" },
                { path: "freelancerId", select: "name email profilePic" }
            ]);
        });
    }
    ;
    getCompletedContracts(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._contractRepository.getCompletedContractsByFreelancer(freelancerId);
        });
    }
    ;
}
exports.FreelancerContractService = FreelancerContractService;
