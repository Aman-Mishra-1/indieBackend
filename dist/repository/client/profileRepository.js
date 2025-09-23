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
exports.CProfileRepository = void 0;
const clientModel_1 = __importDefault(require("../../models/client/clientModel"));
const baseRepository_1 = require("../base/baseRepository");
const messageConstants_1 = require("../../constants/messageConstants");
class CProfileRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(clientModel_1.default);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    ;
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findOne({ userId })
                .populate("userId", "email")
                .exec();
        });
    }
    updateProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProfile = yield this.model.findOne({ userId });
                const updatedFeilds = {
                    firstName: profileData.firstName,
                    city: profileData.city,
                    state: profileData.state,
                    profilePic: profileData.profilePic || (existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.profilePic),
                    profileCompleted: true
                };
                return yield this.model.findOneAndUpdate({ userId }, { $set: updatedFeilds }, { new: true, upsert: true });
            }
            catch (error) {
                throw new Error(messageConstants_1.Messages.ERROR_UPDATING_PROFILE);
            }
        });
    }
    ;
}
exports.CProfileRepository = CProfileRepository;
;
