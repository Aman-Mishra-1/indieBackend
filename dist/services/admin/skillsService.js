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
exports.SkillsService = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
class SkillsService {
    constructor(skillsRepository) {
        this.skillsRepository = skillsRepository;
    }
    getSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.skillsRepository.findAll();
        });
    }
    ;
    // async addSkills(data: Partial<ISkills>): Promise<ISkills> {
    //     const skillsName = data.name!.trim()
    //     const existingSkills = await this.skillsRepository.findByName(skillsName.toLocaleLowerCase())
    //     if (existingSkills) {
    //         throw createHttpError(HttpStatus.CONFLICT, Messages.SKILLS_EXIST)
    //     }
    //     return await this.skillsRepository.create({...data, name: skillsName})
    // };
    addSkills(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const skillsName = data.name.trim();
            const existingSkills = yield this.skillsRepository.findByName(skillsName.toLowerCase());
            if (existingSkills) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.CONFLICT, messageConstants_1.Messages.SKILLS_EXIST);
            }
            return yield this.skillsRepository.create(Object.assign(Object.assign({}, data), { name: skillsName }));
        });
    }
    ;
    editSkills(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.name) {
                const skillsName = data.name.trim();
                const existingSkills = yield this.skillsRepository.findByName(skillsName.toLowerCase());
                if (existingSkills && existingSkills.id !== id) {
                    throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.CONFLICT, messageConstants_1.Messages.SKILLS_EXIST);
                }
                data.name = skillsName;
            }
            const updatedSkils = yield this.skillsRepository.findByIdAndUpdate(id, data);
            if (!updatedSkils) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.SKILLS_NOT_FOUND);
            }
            return updatedSkils;
        });
    }
    ;
    listSkills(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const skills = yield this.skillsRepository.findByIdAndUpdate(id, { isListed: true });
            if (!skills) {
                (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.SKILLS_NOT_FOUND);
            }
        });
    }
    ;
    unlistSkills(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const skills = yield this.skillsRepository.findByIdAndUpdate(id, { isListed: false });
            if (!skills) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.SKILLS_NOT_FOUND);
            }
        });
    }
    ;
}
exports.SkillsService = SkillsService;
;
