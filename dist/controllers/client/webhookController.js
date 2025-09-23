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
const statusContstants_1 = require("../../constants/statusContstants");
const stripe_1 = __importDefault(require("stripe"));
const env_config_1 = require("../../config/env.config");
const escrowModel_1 = __importDefault(require("../../models/admin/escrowModel"));
const contractModel_1 = __importDefault(require("../../models/client/contractModel"));
const stripe = new stripe_1.default(env_config_1.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia"
});
class WebhookController {
    stripeWebhook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            console.log('🔹 Received a request in webhook');
            const sig = req.headers["stripe-signature"];
            if (!sig) {
                console.error("❌ Missing Stripe signature in header");
                res.status(statusContstants_1.HttpStatus.BAD_REQUEST).send('Missing stripe-signature in header');
                return;
            }
            let event;
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, env_config_1.env.STRIPE_WEBHOOK_SECRET);
                console.log('✅ Webhook signature verification successful');
            }
            catch (error) {
                console.error('❌ Webhook signature verification failed:', error.message);
                res.status(statusContstants_1.HttpStatus.BAD_REQUEST).send(`Webhook Error: ${error.message}`);
                return;
            }
            try {
                switch (event.type) {
                    case "checkout.session.completed":
                        const session = event.data.object;
                        console.log("💰 Checkout session completed.");
                        const clientId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.clientId;
                        const freelancerId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.freelancerId;
                        const jobId = (_c = session.metadata) === null || _c === void 0 ? void 0 : _c.jobId;
                        const paymentAmount = session.amount_total ? session.amount_total / 100 : 0;
                        if (!clientId || !freelancerId || !jobId) {
                            console.error("❌ Missing metadata in Stripe session.");
                            res.status(statusContstants_1.HttpStatus.BAD_REQUEST).send("Metadata missing in session");
                            return;
                        }
                        console.log(`✅ Client ${clientId} paid for job ${jobId}, amount: ${paymentAmount}`);
                        const platformFee = paymentAmount * 0.10;
                        const freelancerEarning = paymentAmount - platformFee;
                        const contract = yield contractModel_1.default.findOneAndUpdate({ clientId, jobId }, { $set: { escrowPaid: true, status: "Started" } }, { new: true, upsert: true });
                        if (!contract) {
                            console.error("❌ Contract not found or couldn't be created.");
                            res.status(statusContstants_1.HttpStatus.INTERNAL_SERVER_ERROR).send("Contract not found");
                            return;
                        }
                        yield escrowModel_1.default.create({
                            clientId,
                            freelancerId,
                            jobId,
                            contractId: contract._id,
                            amount: paymentAmount,
                            platformFee,
                            freelancerEarning,
                            status: "funded",
                            transactionType: "credit"
                        });
                        console.log(`✅ Contract status updated to "Started" for job ${jobId}`);
                        res.status(statusContstants_1.HttpStatus.OK).send("Escrow funded & contract started");
                        return;
                    case "checkout.session.expired":
                        console.log("⚠️ Payment session expired.");
                        res.status(statusContstants_1.HttpStatus.OK).send("Session expired");
                        return;
                    default:
                        console.log(`🔸 Unhandled event type: ${event.type}`);
                        res.status(statusContstants_1.HttpStatus.OK).send(`Unhandled event: ${event.type}`);
                        return;
                }
            }
            catch (error) {
                console.error("❌ Error processing webhook event:", error.message);
                res.status(statusContstants_1.HttpStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");
            }
        });
    }
}
exports.default = WebhookController;
;
