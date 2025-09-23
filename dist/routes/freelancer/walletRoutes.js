"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletRepository_1 = require("../../repository/admin/walletRepository");
const walletService_1 = require("../../services/admin/walletService");
const walletController_1 = require("../../controllers/admin/walletController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
const walletRepository = new walletRepository_1.WalletRepository();
const walletService = new walletService_1.WalletService(walletRepository);
const walletController = new walletController_1.WalletController(walletService);
router.get("/earnings/:userId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('freelancer', 'client'), walletController.getWallet.bind(walletController));
router.get("/transactions/:walletId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('freelancer', 'client'), walletController.getUserTransactions.bind(walletController));
router.get("/user-sales-report/:userId", walletController.userSalesReport.bind(walletController));
exports.default = router;
