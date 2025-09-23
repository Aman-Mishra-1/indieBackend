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
exports.deleteOtp = exports.verifyOtp = exports.storeOtp = exports.sendOtp = exports.generateOtp = void 0;
const redis_config_1 = __importDefault(require("../config/redis.config"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../utils/email");
const generateOtp = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
exports.generateOtp = generateOtp;
const sendOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = `
        <div style="max-width: 500px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #007bff; text-align: center;">Welcome to Skillora!</h2>
            <p style="font-size: 16px; color: #555; text-align: center;">Use the OTP below to verify your email and complete your registration.</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; color: #333;">
                    ${otp}
                </span>
            </div>
            <p style="color: #888; text-align: center;">This OTP is valid for only <strong>5 minutes</strong>. Do not share it with anyone.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="font-size: 14px; color: #777; text-align: center;">If you didn’t request this, please ignore this email.</p>
        </div>
    `;
    yield (0, email_1.sendEmail)(email, "IndieConnect OTP Verification", "", htmlContent);
});
exports.sendOtp = sendOtp;
const storeOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_config_1.default.setEx(email, 60, otp);
    console.log(`[DEBUG] Stored OTP for ${email}: ${otp}`);
    const ttl = yield redis_config_1.default.ttl(email);
    console.log(`[DEBUG] OTP for ${email} will expire in ${ttl} seconds.`);
});
exports.storeOtp = storeOtp;
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const storedOtp = yield redis_config_1.default.get(email);
    if (!storedOtp) {
        return { success: false, message: "OTP has expired. Please request a new one." };
    }
    if (storedOtp !== otp) {
        return { success: false, message: "Incorrect OTP. Please try again." };
    }
    return { success: true };
});
exports.verifyOtp = verifyOtp;
const deleteOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_config_1.default.del(email);
});
exports.deleteOtp = deleteOtp;
