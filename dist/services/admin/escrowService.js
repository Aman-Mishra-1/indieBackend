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
exports.EscrowService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
class EscrowService {
    constructor(_escrowRepository, _contractRepository, _walletRepository) {
        this._escrowRepository = _escrowRepository;
        this._contractRepository = _contractRepository;
        this._walletRepository = _walletRepository;
    }
    getTotalAmountInEscrow() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._escrowRepository.getTotalAmountInEscrow();
        });
    }
    getTotalPlatformRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._escrowRepository.getTotalRevenue();
        });
    }
    ;
    releaseToFreelancer(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._contractRepository.findById(contractId);
            if (!contract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CONTRACT_NOT_FOUND);
            }
            const escrow = yield this._escrowRepository.findOne({
                contractId: new mongoose_1.default.Types.ObjectId(contractId),
                status: "funded"
            });
            if (!escrow) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.ESCROW_NOT_FOUND);
            }
            if (contract.releaseFundStatus === "Approved") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.ALREADY_FUNDED);
            }
            if (escrow.amount <= 0) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, "Escrow already released");
            }
            yield this._walletRepository.addFunds(contract.freelancerId.toString(), escrow.freelancerEarning, "Contract payment", "credit", contractId);
            yield this._contractRepository.updateOne({ _id: contractId }, { releaseFundStatus: "Approved" });
            yield this._escrowRepository.updateOne({ _id: escrow._id }, { amount: 0, status: "released" });
            const updatedEscrow = yield this._escrowRepository.findById(escrow._id);
            return updatedEscrow;
        });
    }
    ;
    refundToClient(contractId, clientId, cancelReason, cancelReasonDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._contractRepository.getContractById(contractId);
            if (!contract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CONTRACT_NOT_FOUND);
            }
            if (contract.clientId.toString() !== clientId) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.ACCESS_DENIED);
            }
            const escrow = yield this._escrowRepository.findOne({
                contractId: new mongoose_1.default.Types.ObjectId(contractId),
                clientId: new mongoose_1.default.Types.ObjectId(clientId),
                status: "funded"
            });
            if (!escrow) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.ESCROW_NOT_FOUND);
            }
            if (escrow.status === "refunded") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.ALREADY_REFUNDED);
            }
            let refundAmount = escrow.amount;
            let platformFeeDeduction = 0;
            let freelancerAmount = 0;
            if (contract.status === "Pending") {
                platformFeeDeduction = escrow.platformFee;
                refundAmount = escrow.amount - platformFeeDeduction;
            }
            else if (contract.status === "Started") {
                platformFeeDeduction = escrow.platformFee;
                freelancerAmount = escrow.freelancerEarning * 0.15; // 15% of freelancer's earnings
                refundAmount = escrow.amount - platformFeeDeduction - freelancerAmount;
            }
            else if (contract.status === "Ongoing") {
                platformFeeDeduction = escrow.platformFee;
                freelancerAmount = escrow.freelancerEarning * 0.4; // 40% of freelancer's earnings
                refundAmount = escrow.amount - platformFeeDeduction - freelancerAmount;
            }
            else if (contract.status === "Completed") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.REFUND_NOT_ALLOWED);
            }
            else if (contract.status === "Canceled") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.CONTRACT_CANCELLED);
            }
            // Process refund to client's wallet
            yield this._walletRepository.addFunds(clientId, refundAmount, "Contract refund", "credit", contract._id);
            // If freelancer should get partial payment
            if (freelancerAmount > 0) {
                yield this._walletRepository.addFunds(contract.freelancerId.toString(), freelancerAmount, "Partial payment for canceled contract", "credit", contract._id);
            }
            // Update escrow status
            const updatedEscrow = yield this._escrowRepository.updateEscrow(escrow._id.toString(), {
                status: "refunded",
                amount: 0,
                updatedAt: new Date()
            });
            yield this._contractRepository.findByIdAndUpdate(contractId, {
                status: "Canceled",
                canceledBy: "Client",
                cancelReason: cancelReason || "Requested by client",
                cancelReasonDescription: cancelReasonDescription || "",
                releaseFundStatus: "Approved"
            });
            return updatedEscrow;
        });
    }
    ;
    processFreelancerPaymentRequest(contractId, freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find contract and verify freelancer
            const contract = yield this._contractRepository.getContractById(contractId);
            if (!contract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CONTRACT_NOT_FOUND);
            }
            if (contract.freelancerId.toString() !== freelancerId) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.ACCESS_DENIED);
            }
            if (contract.status !== "Canceled") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.PAYMENT_REQUEST_NOT_VALID);
            }
            const escrow = yield this._escrowRepository.findOne({
                contractId: new mongoose_1.default.Types.ObjectId(contractId),
                status: "funded"
            });
            if (!escrow) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.ESCROW_NOT_FOUND);
            }
            const paymentAmount = escrow.freelancerEarning * 0.5;
            // Add payment to freelancer wallet
            // await this._walletRepository.addFunds(
            //     freelancerId,
            //     paymentAmount,
            //     "Partial contract payment for canceled contract",
            //     "credit"
            // );
            const updatedEscrow = yield this._escrowRepository.findByIdAndUpdate(escrow._id.toString(), {
                status: "released",
                freelancerEarning: paymentAmount,
                updatedAt: new Date()
            });
            return updatedEscrow;
        });
    }
    ;
    getAdminTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._escrowRepository.getAdminTransactions();
            }
            catch (error) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.INTERNAL_SERVER_ERROR, messageConstants_1.Messages.FAILED);
            }
        });
    }
    ;
    getMonthlySalesReport() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._escrowRepository.getMonthlySalesReport();
        });
    }
    ;
}
exports.EscrowService = EscrowService;
;
