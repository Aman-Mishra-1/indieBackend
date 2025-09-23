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
exports.ProfileRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const freelancerModel_1 = __importDefault(require("../../models/freelancer/freelancerModel"));
const baseRepository_1 = require("../../repository/base/baseRepository");
const messageConstants_1 = require("../../constants/messageConstants");
class ProfileRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(freelancerModel_1.default);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    ;
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) })
                    .populate("skills", "name")
                    .populate("jobCategory", "name");
            }
            catch (error) {
                throw new Error(messageConstants_1.Messages.ERROR_FETCHING_PROFILE);
            }
        });
    }
    ;
    updateProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('INSIDE REPOOO :', profileData);
                const existingProfile = yield this.model.findOne({ userId });
                const updatedSkills = profileData.skills
                    ? profileData.skills.map((skill) => skill._id.toString())
                    : (existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.skills.map((skill) => skill.toString())) || [];
                const updatedLanguages = profileData.language || [];
                const updateFields = {
                    title: profileData.title,
                    firstName: profileData.firstName,
                    bio: profileData.bio,
                    city: profileData.city,
                    experienceLevel: profileData.experienceLevel,
                    jobCategory: profileData.jobCategory,
                    skills: updatedSkills,
                    language: updatedLanguages,
                    education: profileData.education,
                    employmentHistory: profileData.employmentHistory,
                    linkedAccounts: profileData.linkedAccounts,
                    profilePic: profileData.profilePic || (existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.profilePic),
                    profileCompleted: true,
                };
                console.log("📌 Updating profile with:", updateFields);
                return yield this.model
                    .findOneAndUpdate({ userId }, { $set: updateFields }, { new: true, upsert: true })
                    .populate("skills", "name")
                    .populate("jobCategory", "name");
            }
            catch (error) {
                throw new Error(messageConstants_1.Messages.ERROR_UPDATING_PROFILE);
            }
        });
    }
    ;
}
exports.ProfileRepository = ProfileRepository;
