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
exports.FreelancerContractController = void 0;
const statusContstants_1 = require("../../constants/statusContstants");
const messageConstants_1 = require("../../constants/messageConstants");
class FreelancerContractController {
    constructor(_freelancerContractService) {
        this._freelancerContractService = _freelancerContractService;
    }
    approveContract(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractId = req.params.contractId;
                const freelancerId = req.params.freelancerId;
                if (!contractId || !freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                const contract = yield this._freelancerContractService.approveContract(contractId, freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.CONTRACT_APPROVE, contract });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    updateContractStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractId = req.params.contractId;
                const status = req.body.status;
                if (!contractId || !status) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                const contract = yield this._freelancerContractService.updateContractStatus(contractId, status);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    message: messageConstants_1.Messages.CONTRACT_STATUS_UPDATED,
                    contract
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getFreelancerContracts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancerId = req.params.freelancerId;
                if (!freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.USER_NOT_FOUND });
                    return;
                }
                const contracts = yield this._freelancerContractService.getFreelancerContracts(freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    count: contracts.length,
                    contracts
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    viewContractDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractId = req.params.contractId;
                if (!contractId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                const contract = yield this._freelancerContractService.getContractById(contractId);
                if (!contract) {
                    res.status(statusContstants_1.HttpStatus.NOT_FOUND).json({ message: messageConstants_1.Messages.CONTRACT_NOT_FOUND });
                    return;
                }
                res.status(statusContstants_1.HttpStatus.OK).json({ contract });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getCompletedContracts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerId } = req.params;
                if (!freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                const contracts = yield this._freelancerContractService.getCompletedContracts(freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    count: contracts.length,
                    contracts
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
exports.FreelancerContractController = FreelancerContractController;
