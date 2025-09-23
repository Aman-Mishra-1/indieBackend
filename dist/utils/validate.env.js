"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateEnv;
const env_config_1 = require("../config/env.config");
function validateEnv() {
    if (!env_config_1.env.PORT) {
        throw new Error('PORT is not defined in env');
    }
    if (!env_config_1.env.MONGODB_URL) {
        throw new Error('MONGODB_URL is not defined in env');
    }
    if (!env_config_1.env.JWT_SECRET) {
        throw new Error('JWT_Secret is not defined in env');
    }
    if (!env_config_1.env.REFRESH_SECRET) {
        throw new Error('REFRESH_SECRET is not defined in env');
    }
    if (!env_config_1.env.CLIENT_URL) {
        throw new Error('CLIENT_URL is not defined in env');
    }
    if (!env_config_1.env.EMAIL_USER) {
        throw new Error('EMAIL_USER is not defined in env');
    }
    if (!env_config_1.env.EMAIL_PASS) {
        throw new Error('EMAIL_PASS is not defined in env');
    }
    if (!env_config_1.env.CLOUDINARY_CLOUD_NAME) {
        throw new Error('CLOUDINARY_CLOUD_NAME is not defined in env');
    }
    if (!env_config_1.env.CLOUDINARY_API_KEY) {
        throw new Error('CLOUDINARY_API_KEY is not defined in env');
    }
    if (!env_config_1.env.CLOUDINARY_API_SECRET) {
        throw new Error('CLOUDINARY_API_SECRET is not defined in env');
    }
    if (!env_config_1.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not defined in env');
    }
    if (!env_config_1.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined in env');
    }
}
