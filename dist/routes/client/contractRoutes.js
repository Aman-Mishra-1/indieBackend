"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractRepository_1 = require("../../repository/client/contractRepository");
const jobRepository_1 = require("../../repository/client/jobRepository");
const applicationRepository_1 = require("../../repository/client/applicationRepository");
const contractService_1 = require("../../services/client/contractService");
const contractController_1 = require("../../controllers/client/contractController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const escrowRepository_1 = require("../../repository/admin/escrowRepository");
const walletRepository_1 = require("../../repository/admin/walletRepository");
const escrowService_1 = require("../../services/admin/escrowService");
const router = express_1.default.Router();
// ✅ first create repositories
const contractRepository = new contractRepository_1.ContractRepository();
const jobRepository = new jobRepository_1.JobRepository();
const applicationRepository = new applicationRepository_1.ApplicationRepository();
const escrowRepository = new escrowRepository_1.EscrowRepository();
const walletRepository = new walletRepository_1.WalletRepository();
// ✅ now pass contractRepository correctly
const escrowService = new escrowService_1.EscrowService(escrowRepository, contractRepository, walletRepository);
// ✅ inject escrow service into contract service
const contractService = new contractService_1.ContractService(contractRepository, jobRepository, applicationRepository, escrowService);
const contractController = new contractController_1.ContractController(contractService);
router.post("/create-contract/:jobId/", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)("client"), contractController.createContract.bind(contractController));
router.delete("/cancel-contract/:contractId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)("client", "freelancer"), contractController.cancelContract.bind(contractController));
router.get("/is-created/:jobId/:clientId", contractController.isContractExist.bind(contractController));
router.get("/get-contracts/:clientId", contractController.getClientContracts.bind(contractController));
router.get("/all-contracts", contractController.getAllContractsForAdmin.bind(contractController));
router.patch("/release-fund/:contractId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)("client"), contractController.requestFundRelease.bind(contractController));
router.put("/complete/:contractId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)("client"), // only client can complete contract
contractController.completeContract.bind(contractController));
exports.default = router;
