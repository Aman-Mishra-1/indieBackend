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
exports.ProfileController = void 0;
const statusContstants_1 = require("../../constants/statusContstants");
const messageConstants_1 = require("../../constants/messageConstants");
class ProfileController {
    constructor(_profileService) {
        this._profileService = _profileService;
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._profileService.getProfile(req.params.id);
                res.status(statusContstants_1.HttpStatus.OK).json({ data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const profileData = req.body;
                if (!userId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.USER_NOT_FOUND });
                }
                const updatedProfile = yield this._profileService.updateProfile(userId, profileData);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.PROFILE_UPDATED, data: updatedProfile });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    uploadProfileImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.params.id;
                if (!req.file) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.NO_FILE });
                }
                const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                yield this._profileService.updateProfile(userId, { profilePic: imageUrl });
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.PROFILE_PICTURE_UPDATE, imageUrl });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
exports.ProfileController = ProfileController;
