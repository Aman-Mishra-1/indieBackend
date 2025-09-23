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
exports.WalletService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const httpError_1 = require("../../utils/httpError");
const statusContstants_1 = require("../../constants/statusContstants");
const messageConstants_1 = require("../../constants/messageConstants");
class WalletService {
    constructor(_walletRepository) {
        this._walletRepository = _walletRepository;
    }
    getWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet = yield this._walletRepository.findOne({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                isDeleted: false,
            });
            if (!wallet) {
                wallet = yield this._walletRepository.create({
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    balance: 0,
                    transactions: [],
                });
            }
            return wallet;
        });
    }
    addFunds(userId, amount, description, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.INVALID_AMOUNT);
            }
            return yield this._walletRepository.addFunds(userId, amount, description, type);
        });
    }
    getUserTransactions(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._walletRepository.getUserTransactions(walletId);
        });
    }
    getUserSalesReport(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._walletRepository.userSalesReport(userId);
        });
    }
}
exports.WalletService = WalletService;
