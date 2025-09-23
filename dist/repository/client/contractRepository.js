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
exports.ContractRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contractModel_1 = __importDefault(require("../../models/client/contractModel"));
const baseRepository_1 = require("../base/baseRepository");
class ContractRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(contractModel_1.default);
    }
    createContract(contractData) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = new contractModel_1.default(contractData);
            return yield this.create(contract);
        });
    }
    getContractsByClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({
                clientId: new mongoose_1.default.Types.ObjectId(clientId),
                isDeleted: false
            })
                .populate('jobId')
                .populate('freelancerId', 'name email profilePic')
                .sort({ createdAt: -1 });
        });
    }
    ;
    getContractByJobId(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield contractModel_1.default.findOne({
                jobId: new mongoose_1.default.Types.ObjectId(jobId),
                isDeleted: false
            });
        });
    }
    ;
    getContractsByFreelancer(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({
                freelancerId: new mongoose_1.default.Types.ObjectId(freelancerId)
            })
                .populate('jobId')
                .populate('clientId', 'name email profilePic')
                .sort({ createdAt: -1 })
                .lean();
        });
    }
    ;
    deleteContract(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(contractId) }, { isDeleted: true, status: "Cancelled" }, { new: true });
        });
    }
    ;
    getContractById(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield contractModel_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(contractId) });
        });
    }
    ;
    findAllContracts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ isDeleted: false })
                .populate("clientId", "name email profilePic")
                .populate("freelancerId", "name email profilePic");
        });
    }
}
exports.ContractRepository = ContractRepository;
