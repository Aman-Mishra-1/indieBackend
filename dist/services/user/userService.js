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
exports.UserService = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
const otp_1 = require("../../utils/otp");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const googleAuth_1 = require("../../utils/googleAuth");
const resetPassToken_1 = require("../../utils/resetPassToken");
class UserService {
    constructor(userRepository, freelancerRepository, clientRepository) {
        this.userRepository = userRepository;
        this.freelancerRepository = freelancerRepository;
        this.clientRepository = clientRepository;
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.CONFLICT, messageConstants_1.Messages.USER_EXIST);
            }
            const otp = (0, otp_1.generateOtp)();
            yield (0, otp_1.sendOtp)(userData.email, otp);
            yield (0, otp_1.storeOtp)(userData.email, otp);
            return { status: statusContstants_1.HttpStatus.OK, message: messageConstants_1.Messages.OTP_SENT };
        });
    }
    ;
    verifyOtpAndCreateUser(email, otp, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidOtp = yield (0, otp_1.verifyOtp)(email, otp);
            if (!isValidOtp.success) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, isValidOtp.message || 'Otp validation fail in service');
            }
            if (!userData.password) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.PASSWORD_REQUIRED);
            }
            userData.password = yield (0, password_1.hashPassword)(userData.password);
            const user = yield this.userRepository.create(userData);
            yield (0, otp_1.deleteOtp)(email);
            if (userData.role === "freelancer") {
                console.log("Creating Freelancer Profile for:", email);
                yield this.freelancerRepository.create({
                    userId: user.id,
                    firstName: user.name,
                    title: "",
                    bio: "",
                    profilePic: "",
                    skills: [],
                    jobCategory: null,
                    city: "",
                    state: "",
                    country: "",
                    zip: "",
                    language: [],
                    portfolio: [],
                    education: { college: "", course: "" },
                    experienceLevel: "Beginner",
                    employmentHistory: []
                });
            }
            if (userData.role === "client") {
                yield this.clientRepository.create({
                    userId: user.id,
                    firstName: user.name,
                    city: "",
                    state: "",
                    profilePic: "",
                });
            }
            return { status: statusContstants_1.HttpStatus.CREATED, message: messageConstants_1.Messages.SIGNUP_SUCCESS };
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, otp_1.deleteOtp)(email);
            const newOtp = (0, otp_1.generateOtp)();
            (0, otp_1.sendOtp)(email, newOtp);
            yield (0, otp_1.storeOtp)(email, newOtp);
            return { status: statusContstants_1.HttpStatus.OK, message: messageConstants_1.Messages.OTP_SENT };
        });
    }
    ;
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.USER_NOT_FOUND);
            }
            const validPassword = yield (0, password_1.comparePassword)(password, user.password);
            if (!validPassword) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.INVALID_CREDENTIALS);
            }
            if (user.status === 'blocked') {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.USER_BLOCKED);
            }
            const accessToken = (0, jwt_1.generateAccessToken)(user.id.toString(), user.role);
            const refreshToken = (0, jwt_1.generateRefreshToken)(user.id.toString(), user.role);
            return {
                status: statusContstants_1.HttpStatus.OK,
                message: messageConstants_1.Messages.LOGIN_SUCCESS,
                accessToken,
                refreshToken,
                role: user.role,
                user: {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    profilePic: user.profilePic || "",
                },
            };
        });
    }
    ;
    refreshAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            if (!decoded) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.UNAUTHORIZED, messageConstants_1.Messages.INVALID_TOKEN);
            }
            const accessToken = (0, jwt_1.generateAccessToken)(decoded.id, decoded.role);
            return accessToken;
        });
    }
    ;
    //Google Auth
    googleLogin(token, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const googleUser = yield (0, googleAuth_1.verifyGoogleToken)(token);
            if (!googleUser || !googleUser.email || !googleUser.name) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.UNAUTHORIZED, messageConstants_1.Messages.INVALID_GOOGLE_TOKEN);
            }
            let user = yield this.userRepository.findByEmail(googleUser.email);
            console.log("Google Login User Data:", user);
            if (!user) {
                user = yield this.userRepository.create({
                    name: googleUser.name,
                    email: googleUser.email,
                    profilePic: googleUser.profilePic || "",
                    role,
                    status: "active",
                    password: "",
                    isGoogleAuth: true
                });
            }
            console.log("User status before returning:", user.status);
            if (user.status === "blocked") {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.USER_BLOCKED);
            }
            const accessToken = (0, jwt_1.generateAccessToken)(user.id.toString(), user.role);
            const refreshToken = (0, jwt_1.generateRefreshToken)(user.id.toString(), user.role);
            if (user.role === "freelancer") {
                const existingFreelancer = yield this.freelancerRepository.findByUserId(user.id.toString());
                if (!existingFreelancer) {
                    yield this.freelancerRepository.create({
                        userId: user.id,
                        firstName: user.name,
                        title: "",
                        bio: "",
                        profilePic: googleUser.profilePic,
                        skills: [],
                        jobCategory: null,
                        city: "",
                        state: "",
                        country: "",
                        zip: "",
                        language: [],
                        profileCompleted: false,
                        portfolio: [],
                        education: { college: "", course: "" },
                        experienceLevel: "Beginner",
                        employmentHistory: []
                    });
                }
            }
            if (user.role === "client") {
                const existingClient = yield this.clientRepository.findByUserId(user.id.toString());
                if (!existingClient) {
                    yield this.clientRepository.create({
                        userId: user.id,
                        firstName: user.name,
                        city: "",
                        state: "",
                        profilePic: "",
                    });
                }
            }
            ;
            return {
                status: statusContstants_1.HttpStatus.OK,
                message: messageConstants_1.Messages.LOGIN_SUCCESS,
                accessToken,
                refreshToken,
                role: user.role,
                user: {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    profilePic: user.profilePic,
                    status: user.status || "active",
                },
            };
        });
    }
    ;
    resetPassword(email, currentPassword, newPassword, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.USER_NOT_FOUND);
            }
            const isPasswordValid = yield (0, password_1.comparePassword)(currentPassword, user.password);
            if (!isPasswordValid) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.CURRENT_PASSWORD_WRONG);
            }
            if (newPassword !== confirmPassword) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.PASSWORD_NOT_MATCH);
            }
            const hashedPassword = yield (0, password_1.hashPassword)(newPassword);
            yield this.userRepository.updatePassword(email, hashedPassword);
            return { status: statusContstants_1.HttpStatus.OK, message: messageConstants_1.Messages.PASSWORD_RESET_SUCCESS };
        });
    }
    ;
    sendResetPasswordLink(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.USER_NOT_FOUND);
            }
            if (user.isGoogleAuth) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.GOOGLE_ACCOUNT);
            }
            yield (0, resetPassToken_1.generateAndStoreResetToken)(email);
            return { message: messageConstants_1.Messages.RESET_LINK_SENT };
        });
    }
    ;
    resetPasswordWithToken(token, newPassword, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.RESET_TOKEN_REQUIRED);
            }
            if (newPassword !== confirmPassword) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.PASSWORD_NOT_MATCH);
            }
            const email = yield (0, resetPassToken_1.verifyResetToken)(token);
            if (!email) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, messageConstants_1.Messages.RESET_TOKEN_INVALID);
            }
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.USER_NOT_FOUND);
            }
            const hashedPassword = yield (0, password_1.hashPassword)(newPassword);
            yield this.userRepository.updatePassword(email, hashedPassword);
            yield (0, resetPassToken_1.deleteResetToken)(token);
            return { message: messageConstants_1.Messages.PASSWORD_RESET_SUCCESS };
        });
    }
    ;
}
exports.UserService = UserService;
;
