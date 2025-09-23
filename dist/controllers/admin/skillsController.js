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
exports.SKillsController = void 0;
const statusContstants_1 = require("../../constants/statusContstants");
const messageConstants_1 = require("../../constants/messageConstants");
class SKillsController {
    constructor(_skillsService) {
        this._skillsService = _skillsService;
    }
    getSkills(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._skillsService.getSkills();
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    addSkills(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._skillsService.addSkills(req.body);
                res.status(statusContstants_1.HttpStatus.CREATED).json({ success: true, data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    editSkills(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._skillsService.editSkills(req.params.id, req.body);
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    listSkills(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._skillsService.listSkills(req.params.id);
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, message: messageConstants_1.Messages.SKILLS_LISTED });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    unlistSkills(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._skillsService.unlistSkills(req.params.id);
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, message: messageConstants_1.Messages.SKILLS_UNLISTED });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
exports.SKillsController = SKillsController;
;
