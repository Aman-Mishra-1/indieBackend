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
exports.deleteResetToken = exports.verifyResetToken = exports.generateAndStoreResetToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
const env_config_1 = require("../config/env.config");
const email_1 = require("./email");
const generateAndStoreResetToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const redisKey = `resetToken:${token}`;
    yield redis_config_1.default.setEx(redisKey, 15 * 60, email);
    const resetUrl = `${env_config_1.env.CLIENT_URL}/reset-password?token=${token}`;
    const htmlContent = `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
            <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center;">
                <h2 style="color: #007bff;">Reset Your Password</h2>
                <p style="font-size: 16px;">We received a request to reset your Skillora account password.</p>
                <a href="${resetUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
                <p style="font-size: 14px; color: #666;">This link will expire in <strong>15 minutes</strong>.</p>
                <p style="font-size: 14px; color: #999;">If you didn’t request this, please ignore this email.</p>
            </div>
        </div>
    `;
    yield (0, email_1.sendEmail)(email, 'Skillora - Password Reset Link', '', htmlContent);
    return token;
});
exports.generateAndStoreResetToken = generateAndStoreResetToken;
const verifyResetToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const redisKey = `resetToken:${token}`;
    const email = yield redis_config_1.default.get(redisKey);
    return email;
});
exports.verifyResetToken = verifyResetToken;
const deleteResetToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const redisKey = `resetToken:${token}`;
    yield redis_config_1.default.del(redisKey);
});
exports.deleteResetToken = deleteResetToken;
