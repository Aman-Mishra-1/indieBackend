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
exports.ContractController = void 0;
const statusContstants_1 = require("../../constants/statusContstants");
const messageConstants_1 = require("../../constants/messageConstants");
class ContractController {
    constructor(_contractService) {
        this._contractService = _contractService;
    }
    createContract(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const jobId = req.params.jobId;
                const freelancerId = req.body.freelancerId;
                const amount = req.body.amount;
                if (!jobId || !clientId || !freelancerId || !amount) {
                    res
                        .status(statusContstants_1.HttpStatus.BAD_REQUEST)
                        .json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                const contract = yield this._contractService.createContract(jobId, clientId, freelancerId, amount);
                res
                    .status(statusContstants_1.HttpStatus.CREATED)
                    .json({ message: messageConstants_1.Messages.CONTRACT_CREATE, contract });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getClientContracts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = req.params.clientId;
                if (!clientId) {
                    res
                        .status(statusContstants_1.HttpStatus.BAD_REQUEST)
                        .json({ message: messageConstants_1.Messages.USER_NOT_FOUND });
                    return;
                }
                const contracts = yield this._contractService.getClientContracts(clientId);
                res
                    .status(statusContstants_1.HttpStatus.OK)
                    .json({ count: contracts.length, data: contracts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    cancelContract(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contractId } = req.params;
                if (!contractId) {
                    res
                        .status(statusContstants_1.HttpStatus.BAD_REQUEST)
                        .json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                yield this._contractService.cancelContract(contractId);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.CONTRACT_CANCELLED });
            }
            catch (error) {
                next(error);
            }
        });
    }
    isContractExist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.jobId;
                const clientId = req.params.clientId;
                if (!jobId || !clientId) {
                    res
                        .status(statusContstants_1.HttpStatus.BAD_REQUEST)
                        .json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                const contract = yield this._contractService.isContractExist(jobId, clientId);
                res.status(statusContstants_1.HttpStatus.OK).json({ contract });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllContractsForAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contract = yield this._contractService.getAllContracts();
                res.status(statusContstants_1.HttpStatus.OK).json({ data: contract });
            }
            catch (error) {
                next(error);
            }
        });
    }
    requestFundRelease(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contractId } = req.params;
                if (!contractId) {
                    res
                        .status(statusContstants_1.HttpStatus.BAD_REQUEST)
                        .json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                yield this._contractService.requestFundRelease(contractId);
                res
                    .status(statusContstants_1.HttpStatus.OK)
                    .json({ message: messageConstants_1.Messages.FUND_RELEASE_REQUEST });
            }
            catch (error) {
                next(error);
            }
        });
    }
    completeContract(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contractId } = req.params;
                if (!contractId) {
                    res
                        .status(statusContstants_1.HttpStatus.BAD_REQUEST)
                        .json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                yield this._contractService.completeContract(contractId);
                res
                    .status(statusContstants_1.HttpStatus.OK)
                    .json({ message: "Contract completed and funds released" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ContractController = ContractController;
