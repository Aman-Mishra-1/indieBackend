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
exports.EscrowController = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
class EscrowController {
    constructor(_escrowService) {
        this._escrowService = _escrowService;
    }
    getTotalEscrowBalance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalInEscrow = yield this._escrowService.getTotalAmountInEscrow();
                res.status(statusContstants_1.HttpStatus.OK).json({ data: totalInEscrow });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getTotalRevenue(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalRevenue = yield this._escrowService.getTotalPlatformRevenue();
                res.status(statusContstants_1.HttpStatus.OK).json({ data: totalRevenue });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    releaseFundsToFreelancer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contractId } = req.params;
                if (!contractId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.CONTRACT_NOT_FOUND });
                    return;
                }
                const result = yield this._escrowService.releaseToFreelancer(contractId);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.FUND_RELEASED, data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    refundToClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contractId, clientId } = req.params;
                const { cancelReason, cancelReasonDescription } = req.body;
                if (!contractId || !clientId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.INVALID_REQUEST });
                    return;
                }
                const result = yield this._escrowService.refundToClient(contractId, clientId, cancelReason, cancelReasonDescription);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.REFUND_PROCESSED, data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    processFreelancerPaymentRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contractId } = req.params;
                const { freelancerId } = req.body;
                if (!contractId || !freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.INVALID_REQUEST });
                    return;
                }
                const result = yield this._escrowService.processFreelancerPaymentRequest(contractId, freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.PAYMENT_REQUEST_PROCESSED, data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getAdminTransactions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield this._escrowService.getAdminTransactions();
                res.status(statusContstants_1.HttpStatus.OK).json({
                    count: transactions.length,
                    data: transactions
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getSalesReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield this._escrowService.getMonthlySalesReport();
                res.status(statusContstants_1.HttpStatus.OK).json({ data: report });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
exports.EscrowController = EscrowController;
