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
exports.WalletRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const walletModel_1 = __importDefault(require("../../models/user/walletModel"));
const baseRepository_1 = require("../base/baseRepository");
class WalletRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(walletModel_1.default);
    }
    addFunds(userId, amount, description, type, contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet = (yield this.findOne({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                isDeleted: false,
            }));
            if (!wallet) {
                wallet = (yield this.create({
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    balance: 0,
                    transactions: [],
                }));
            }
            const newBalance = type === "credit" ? wallet.balance + amount : wallet.balance - amount;
            const transaction = Object.assign({ amount,
                description,
                type, date: new Date() }, (contractId && {
                contractId: new mongoose_1.default.Types.ObjectId(contractId),
            }));
            return (yield this.findByIdAndUpdate(wallet._id.toString(), {
                $set: { balance: newBalance },
                $push: { transactions: transaction },
            }, { new: true }));
        });
    }
    getUserTransactions(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(walletId);
            const transactions = yield this.model.aggregate([
                { $match: { _id: objectId } },
                { $unwind: "$transactions" },
                {
                    $lookup: {
                        from: "contracts",
                        localField: "transactions.contractId",
                        foreignField: "_id",
                        as: "contract",
                    },
                },
                { $unwind: { path: "$contract", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "users",
                        localField: "contract.clientId",
                        foreignField: "_id",
                        as: "client",
                    },
                },
                { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        amount: "$transactions.amount",
                        type: "$transactions.type",
                        description: "$transactions.description",
                        date: "$transactions.date",
                        contractId: "$transactions.contractId",
                        clientName: { $ifNull: ["$client.name", null] },
                    },
                },
                { $sort: { date: -1 } },
            ]);
            return transactions;
        });
    }
    userSalesReport(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return walletModel_1.default.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        isDeleted: false,
                    },
                },
                {
                    $unwind: "$transactions",
                },
                {
                    $match: {
                        "transactions.type": "credit",
                        "transactions.contractId": { $exists: true },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$transactions.date" },
                            month: { $month: "$transactions.date" },
                        },
                        totalRevenue: { $sum: "$transactions.amount" },
                        totalTransactions: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                { $toString: "$_id.year" },
                                "-",
                                {
                                    $cond: [
                                        { $lt: ["$_id.month", 10] },
                                        { $concat: ["0", { $toString: "$_id.month" }] },
                                        { $toString: "$_id.month" },
                                    ],
                                },
                            ],
                        },
                        totalRevenue: 1,
                        totalTransactions: 1,
                    },
                },
            ]);
        });
    }
}
exports.WalletRepository = WalletRepository;
