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
exports.UserController = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
class UserController {
    constructor(_userService) {
        this._userService = _userService;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userService.register(req.body);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, userData } = req.body;
                const response = yield this._userService.verifyOtpAndCreateUser(email, otp, userData);
                res.status(statusContstants_1.HttpStatus.CREATED).json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("[DEBUG] Resend OTP request received:", req.body);
                const { email } = req.body;
                const response = yield this._userService.resendOtp(email);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const response = yield this._userService.login(email, password);
                res.cookie("refreshToken", response.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(statusContstants_1.HttpStatus.OK).json({
                    message: response.message,
                    accessToken: response.accessToken,
                    role: response.role,
                    user: response.user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('refreshToken', {
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                });
                res.status(statusContstants_1.HttpStatus.OK).json({ message: messageConstants_1.Messages.LOGOUT_SUCCESS });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    refreshAccessToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Refresh token controller inside...!!');
            try {
                const refreshToken = req.cookies.refreshToken;
                console.log('Refresh token from body:::', refreshToken);
                const accessToken = yield this._userService.refreshAccessToken(refreshToken);
                console.log('New accessToken generated:::', accessToken);
                res.status(statusContstants_1.HttpStatus.OK).json({ accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    googleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, role } = req.body;
                const response = yield this._userService.googleLogin(token, role);
                res.cookie("refreshToken", response.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(statusContstants_1.HttpStatus.OK).json({
                    message: response.message,
                    accessToken: response.accessToken,
                    role: response.role,
                    user: response.user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, currentPassword, newPassword, confirmPassword } = req.body;
                const response = yield this._userService.resetPassword(email, currentPassword, newPassword, confirmPassword);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const response = yield this._userService.sendResetPasswordLink(email);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    resetPasswordWithToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword, confirmPassword } = req.body;
                const response = yield this._userService.resetPasswordWithToken(token, newPassword, confirmPassword);
                res.status(statusContstants_1.HttpStatus.OK).json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
exports.UserController = UserController;
;
