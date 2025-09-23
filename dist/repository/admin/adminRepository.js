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
exports.AdminRepository = void 0;
const userModel_1 = __importDefault(require("../../models/user/userModel"));
const baseRepository_1 = require("../../repository/base/baseRepository");
class AdminRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(userModel_1.default);
    }
    getAllClients() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.find({ role: "client" });
        });
    }
    ;
    getAllFreelancers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.find({ role: "freelancer" });
        });
    }
    ;
    blockFreelancer(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findByIdAndUpdate(freelancerId, { status: "blocked" });
        });
    }
    ;
    blockClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findByIdAndUpdate(clientId, { status: "blocked" });
        });
    }
    ;
    unblockFreelancer(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findByIdAndUpdate(freelancerId, { status: "active" }, { new: true });
        });
    }
    unblockClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findByIdAndUpdate(clientId, { status: "active" }, { new: true });
        });
    }
}
exports.AdminRepository = AdminRepository;
