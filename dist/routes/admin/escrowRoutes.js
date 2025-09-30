"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const escrowRepository_1 = require("../../repository/admin/escrowRepository");
const contractRepository_1 = require("../../repository/client/contractRepository");
const walletRepository_1 = require("../../repository/admin/walletRepository");
const escrowController_1 = require("../../controllers/admin/escrowController");
const escrowService_1 = require("../../services/admin/escrowService");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
const escrowRepository = new escrowRepository_1.EscrowRepository();
const contractRepository = new contractRepository_1.ContractRepository();
const walletRepository = new walletRepository_1.WalletRepository();
const escrowService = new escrowService_1.EscrowService(escrowRepository, contractRepository, walletRepository);
const escrowController = new escrowController_1.EscrowController(escrowService);
router.get("/total-revenue", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), escrowController.getTotalRevenue.bind(escrowController));
router.get("/balance", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), escrowController.getTotalEscrowBalance.bind(escrowController));
router.put("/release-fund/:contractId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), escrowController.releaseFundsToFreelancer.bind(escrowController));
router.put("/refund-client/:contractId/:clientId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin', 'client'), escrowController.refundToClient.bind(escrowController));
router.get("/transactions", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), escrowController.getAdminTransactions.bind(escrowController));
router.get("/sales-report", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), 
// escrowController.getAdminTransactions.bind(escrowController
escrowController.getSalesReport.bind(escrowController));
exports.default = router;
