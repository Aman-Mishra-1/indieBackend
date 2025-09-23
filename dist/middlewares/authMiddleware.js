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
exports.authenticateToken = authenticateToken;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const httpError_1 = require("../utils/httpError");
const statusContstants_1 = require("../constants/statusContstants");
const messageConstants_1 = require("../constants/messageConstants");
const userModel_1 = __importDefault(require("../models/user/userModel"));
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return next((0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.UNAUTHORIZED, messageConstants_1.Messages.TOKEN_REQUIRED));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_config_1.env.JWT_SECRET);
            const user = yield userModel_1.default.findById(decoded.id);
            if (!user) {
                return next((0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.UNAUTHORIZED, messageConstants_1.Messages.USER_NOT_FOUND));
            }
            if (user.status === "blocked") {
                return next((0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.USER_BLOCKED));
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            return next((0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.UNAUTHORIZED, messageConstants_1.Messages.INVALID_TOKEN));
        }
    });
}
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next((0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.NO_ACCESS));
        }
        next();
    };
}
