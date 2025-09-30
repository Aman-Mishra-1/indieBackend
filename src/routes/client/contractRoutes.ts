import express from "express";
import { ContractRepository } from "../../repository/client/contractRepository";
import { JobRepository } from "../../repository/client/jobRepository";
import { ApplicationRepository } from "../../repository/client/applicationRepository";
import { ContractService } from "../../services/client/contractService";
import { ContractController } from "../../controllers/client/contractController";
import {
  authenticateToken,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

import { EscrowRepository } from "../../repository/admin/escrowRepository";
import { WalletRepository } from "../../repository/admin/walletRepository";
import { EscrowService } from "../../services/admin/escrowService";

const router = express.Router();

// ✅ first create repositories
const contractRepository = new ContractRepository();
const jobRepository = new JobRepository();
const applicationRepository = new ApplicationRepository();

const escrowRepository = new EscrowRepository();
const walletRepository = new WalletRepository();

// ✅ now pass contractRepository correctly
const escrowService = new EscrowService(
  escrowRepository,
  contractRepository,
  walletRepository
);

// ✅ inject escrow service into contract service
const contractService = new ContractService(
  contractRepository,
  jobRepository,
  applicationRepository,
  escrowService
);

const contractController = new ContractController(contractService);

router.post(
  "/create-contract/:jobId/",
  authenticateToken,
  authorizeRoles("client"),
  contractController.createContract.bind(contractController)
);

router.delete(
  "/cancel-contract/:contractId",
  authenticateToken,
  authorizeRoles("client", "freelancer"),
  contractController.cancelContract.bind(contractController)
);

router.get(
  "/is-created/:jobId/:clientId",
  contractController.isContractExist.bind(contractController)
);

router.get(
  "/get-contracts/:clientId",
  contractController.getClientContracts.bind(contractController)
);

router.get(
  "/all-contracts",
  contractController.getAllContractsForAdmin.bind(contractController)
);

router.patch(
  "/release-fund/:contractId",
  authenticateToken,
  authorizeRoles("client"),
  contractController.requestFundRelease.bind(contractController)
);

router.put(
  "/complete/:contractId",
  authenticateToken,
  authorizeRoles("client"), // only client can complete contract
  contractController.completeContract.bind(contractController)
);

export default router;
