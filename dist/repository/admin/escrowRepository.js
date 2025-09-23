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
exports.EscrowRepository = void 0;
const escrowModel_1 = __importDefault(require("../../models/admin/escrowModel"));
const baseRepository_1 = require("../base/baseRepository");
class EscrowRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(escrowModel_1.default);
    }
    updateEscrow(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield escrowModel_1.default.findByIdAndUpdate(id, updateData, { new: true })) || null;
        });
    }
    getTotalAmountInEscrow() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.aggregate([
                { $match: { status: "funded" } },
                { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
            ]);
            return result.length > 0 ? result[0].totalAmount : 0;
        });
    }
    ;
    getTotalRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.aggregate([
                { $match: { status: { $in: ["released", "refunded"] } } },
                { $group: { _id: null, totalRevenue: { $sum: "$platformFee" } } }
            ]);
            const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
            return totalRevenue;
        });
    }
    ;
    getAdminTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({
                transactionType: "credit",
                status: { $in: ["funded", "released", "refunded", "released"] }
            })
                .populate('clientId', 'name email')
                .populate('freelancerId', 'name email')
                .populate('contractId')
                .sort({ createdAt: -1 });
        });
    }
    ;
    getMonthlySalesReport() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.aggregate([
                {
                    $match: {
                        status: "released"
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        totalRevenue: { $sum: "$amount" },
                        platformEarnings: { $sum: "$platformFee" },
                        freelancerEarnings: { $sum: "$freelancerEarning" },
                        totalTransactions: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
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
                                        { $toString: "$_id.month" }
                                    ]
                                }
                            ]
                        },
                        totalRevenue: 1,
                        platformEarnings: 1,
                        freelancerEarnings: 1,
                        totalTransactions: 1
                    }
                }
            ]);
        });
    }
    ;
}
exports.EscrowRepository = EscrowRepository;
