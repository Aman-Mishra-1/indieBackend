"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
exports.env = {
    get PORT() {
        return process.env.PORT;
    },
    get MONGODB_URL() {
        return process.env.MONGODB_URL;
    },
    get JWT_SECRET() {
        return process.env.JWT_SECRET;
    },
    get REFRESH_SECRET() {
        return process.env.REFRESH_SECRET;
    },
    get CLIENT_URL() {
        return process.env.CLIENT_URL;
    },
    get EMAIL_USER() {
        return process.env.EMAIL_USER;
    },
    get EMAIL_PASS() {
        return process.env.EMAIL_PASS;
    },
    get CLOUDINARY_CLOUD_NAME() {
        return process.env.CLOUDINARY_CLOUD_NAME;
    },
    get CLOUDINARY_API_KEY() {
        return process.env.CLOUDINARY_API_KEY;
    },
    get CLOUDINARY_API_SECRET() {
        return process.env.CLOUDINARY_API_SECRET;
    },
    get STRIPE_SECRET_KEY() {
        return process.env.STRIPE_SECRET_KEY;
    },
    get STRIPE_WEBHOOK_SECRET() {
        return process.env.STRIPE_WEBHOOK_SECRET;
    }
};
