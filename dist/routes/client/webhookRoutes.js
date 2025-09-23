"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhookController_1 = __importDefault(require("../../controllers/client/webhookController"));
const webhookRoutes = express_1.default.Router();
const webhookController = new webhookController_1.default();
webhookRoutes.post('/', webhookController.stripeWebhook.bind(webhookController));
exports.default = webhookRoutes;
