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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("../config/env.config");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: env_config_1.env.EMAIL_USER,
        pass: env_config_1.env.EMAIL_PASS
    }
});
const sendEmail = (to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: env_config_1.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    });
});
exports.sendEmail = sendEmail;
