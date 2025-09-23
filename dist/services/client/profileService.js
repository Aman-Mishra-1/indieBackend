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
exports.ProfileService = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
class ProfileService {
    constructor(_profileRepository) {
        this._profileRepository = _profileRepository;
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._profileRepository.findByUserId(userId);
        });
    }
    updateProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error(messageConstants_1.Messages.ID_REQUIRED);
            }
            return yield this._profileRepository.updateProfile(userId, profileData);
        });
    }
}
exports.ProfileService = ProfileService;
;
