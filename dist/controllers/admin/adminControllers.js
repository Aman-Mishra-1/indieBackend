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
exports.AdminController = void 0;
const statusContstants_1 = require("../../constants/statusContstants");
class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
    }
    getClients(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield this._adminService.getClients();
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, data: clients });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getFreelancers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancers = yield this._adminService.getFreelancers();
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, data: freelancers });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    blockFreelancer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerId } = req.params;
                const blockedFreelancer = yield this._adminService.blockFreelancer(freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, data: blockedFreelancer });
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId } = req.params;
                const blockedClient = yield this._adminService.blockClient(clientId);
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, data: blockedClient });
            }
            catch (error) {
                next(error);
            }
        });
    }
    unblockFreelancer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerId } = req.params;
                const unblockedFreelancer = yield this._adminService.unblockFreelancer(freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, data: unblockedFreelancer });
            }
            catch (error) {
                next(error);
            }
        });
    }
    unblockClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId } = req.params;
                const unblockedClient = yield this._adminService.unblockClient(clientId);
                res.status(statusContstants_1.HttpStatus.OK).json({ success: true, data: unblockedClient });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminController = AdminController;
