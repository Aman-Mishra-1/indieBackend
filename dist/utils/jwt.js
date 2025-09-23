"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
exports.verifyRefreshToken = verifyRefreshToken;
const env_config_1 = require("../config/env.config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccessToken(userId, role) {
    return jsonwebtoken_1.default.sign({ id: userId, role }, env_config_1.env.JWT_SECRET, { expiresIn: '2h' });
}
function generateRefreshToken(userId, role) {
    return jsonwebtoken_1.default.sign({ id: userId, role }, env_config_1.env.REFRESH_SECRET, { expiresIn: '7d' });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_config_1.env.JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_config_1.env.REFRESH_SECRET);
    }
    catch (error) {
        return null;
    }
}
