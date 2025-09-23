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
exports.WalletController = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
class WalletController {
    constructor(_walletService) {
        this._walletService = _walletService;
    }
    getWallet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.USER_NOT_FOUND });
                    return;
                }
                const wallet = yield this._walletService.getWallet(userId);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    success: true,
                    data: wallet
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    addFunds(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, amount, description } = req.body;
                if (!userId || !amount || !description) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.INVALID_REQUEST });
                    return;
                }
                const wallet = yield this._walletService.addFunds(userId, amount, description, "credit");
                res.status(statusContstants_1.HttpStatus.OK).json({
                    success: true,
                    message: messageConstants_1.Messages.FUNDS_ADDED,
                    data: wallet
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getUserTransactions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { walletId } = req.params;
                if (!walletId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.USER_NOT_FOUND });
                    return;
                }
                const transactions = yield this._walletService.getUserTransactions(walletId);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    success: true,
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
    userSalesReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const report = yield this._walletService.getUserSalesReport(userId);
                res.status(statusContstants_1.HttpStatus.OK).json({ data: report });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
exports.WalletController = WalletController;
