import mongoose from "mongoose";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IEscrowRepository } from "../../interfaces/admin/escrow/IEscrowRepository";
import { IEscrowService } from "../../interfaces/admin/escrow/IEscrowService";
import { IWalletRepository } from "../../interfaces/admin/wallet/IWalletRepository";
import { IContractRepository } from "../../interfaces/client/contract/IContractRepository";
import { IEscrow } from "../../models/admin/escrowModel";
import { createHttpError } from "../../utils/httpError";

export class EscrowService implements IEscrowService {
  constructor(
    private _escrowRepository: IEscrowRepository,
    private _contractRepository: IContractRepository,
    private _walletRepository: IWalletRepository
  ) {}

  async getTotalAmountInEscrow(): Promise<number> {
    return await this._escrowRepository.getTotalAmountInEscrow();
  }

  async getTotalPlatformRevenue(): Promise<number> {
    return await this._escrowRepository.getTotalRevenue();
  }

  async releaseToFreelancer(contractId: string): Promise<IEscrow> {
    console.log("=== [EscrowService.releaseToFreelancer] START ===");
    console.log("ContractId:", contractId);

    const contract = await this._contractRepository.findById(contractId);
    console.log("Contract lookup result:", contract);

    if (!contract) {
      console.error("Contract not found for id:", contractId);
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
    }

    const escrow = await this._escrowRepository.findOne({
      contractId: new mongoose.Types.ObjectId(contractId),
      status: { $in: ["funded", "Funded"] },
    });
    console.log("Escrow lookup result:", escrow);

    if (!escrow) {
      console.error("No funded escrow found for contract:", contractId);
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.ESCROW_NOT_FOUND);
    }

    if (contract.releaseFundStatus === "Approved") {
      console.warn("Funds already released for contract:", contractId);
      throw createHttpError(HttpStatus.BAD_REQUEST, Messages.ALREADY_FUNDED);
    }

    if (escrow.amount <= 0) {
      console.warn("Escrow already released (amount <= 0) for contract:", contractId);
      throw createHttpError(HttpStatus.BAD_REQUEST, "Escrow already released");
    }

    console.log("Crediting wallet for freelancer:", contract.freelancerId?.toString(), 
      "Amount:", escrow.freelancerEarning);

    const wallet = await this._walletRepository.addFunds(
      contract.freelancerId.toString(),
      escrow.freelancerEarning,
      "Contract payment",
      "credit",
      contractId
    );
    console.log("Wallet update result:", wallet);

    await this._contractRepository.updateOne(
      { _id: contractId },
      { releaseFundStatus: "Approved" }
    );
    console.log("Contract releaseFundStatus updated -> Approved");

    await this._escrowRepository.updateOne(
      { _id: escrow._id },
      { amount: 0, status: "released" }
    );
    console.log("Escrow updated -> released");

    const updatedEscrow = await this._escrowRepository.findById(
      escrow._id as string
    );
    console.log("Updated Escrow returned:", updatedEscrow);
    console.log("=== [EscrowService.releaseToFreelancer] END ===");

    return updatedEscrow as IEscrow;
  }

  async refundToClient(
    contractId: string,
    clientId: string,
    cancelReason?: string,
    cancelReasonDescription?: string
  ): Promise<IEscrow> {
    console.log("=== [EscrowService.refundToClient] START ===");
    console.log("contractId:", contractId, "clientId:", clientId);

    const contract = await this._contractRepository.getContractById(contractId);
    console.log("Contract lookup:", contract);

    if (!contract) {
      console.error("Contract not found for refund:", contractId);
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
    }

    if (contract.clientId.toString() !== clientId) {
      console.error("Client mismatch! contract.clientId:", contract.clientId.toString(), "input clientId:", clientId);
      throw createHttpError(HttpStatus.FORBIDDEN, Messages.ACCESS_DENIED);
    }

    const escrow = await this._escrowRepository.findOne({
      contractId: new mongoose.Types.ObjectId(contractId),
      clientId: new mongoose.Types.ObjectId(clientId),
      status: "funded",
    });
    console.log("Escrow lookup result:", escrow);

    if (!escrow) {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.ESCROW_NOT_FOUND);
    }

    if (escrow.status === "refunded") {
      throw createHttpError(HttpStatus.BAD_REQUEST, Messages.ALREADY_REFUNDED);
    }

    let refundAmount = escrow.amount;
    let platformFeeDeduction = 0;
    let freelancerAmount = 0;

    if (contract.status === "Pending") {
      platformFeeDeduction = escrow.platformFee;
      refundAmount = escrow.amount - platformFeeDeduction;
    } else if (contract.status === "Started") {
      platformFeeDeduction = escrow.platformFee;
      freelancerAmount = escrow.freelancerEarning * 0.15;
      refundAmount = escrow.amount - platformFeeDeduction - freelancerAmount;
    } else if (contract.status === "Ongoing") {
      platformFeeDeduction = escrow.platformFee;
      freelancerAmount = escrow.freelancerEarning * 0.4;
      refundAmount = escrow.amount - platformFeeDeduction - freelancerAmount;
    } else if (contract.status === "Completed") {
      throw createHttpError(HttpStatus.BAD_REQUEST, Messages.REFUND_NOT_ALLOWED);
    } else if (contract.status === "Canceled") {
      throw createHttpError(HttpStatus.BAD_REQUEST, Messages.CONTRACT_CANCELLED);
    }

    console.log("Refund calculation:", { refundAmount, platformFeeDeduction, freelancerAmount });

    // Process refund to client
    const clientWallet = await this._walletRepository.addFunds(
      clientId,
      refundAmount,
      "Contract refund",
      "credit",
      contract._id as string
    );
    console.log("Client wallet after refund:", clientWallet);

    // If freelancer gets partial
    if (freelancerAmount > 0) {
      const freelancerWallet = await this._walletRepository.addFunds(
        contract.freelancerId.toString(),
        freelancerAmount,
        "Partial payment for canceled contract",
        "credit",
        contract._id as string
      );
      console.log("Freelancer wallet partial credit:", freelancerWallet);
    }

    // Update escrow
    const updatedEscrow = await this._escrowRepository.updateEscrow(
      escrow._id.toString(),
      {
        status: "refunded",
        amount: 0,
        updatedAt: new Date(),
      }
    );
    console.log("Escrow updated to refunded:", updatedEscrow);

    await this._contractRepository.findByIdAndUpdate(contractId, {
      status: "Canceled",
      canceledBy: "Client",
      cancelReason: cancelReason || "Requested by client",
      cancelReasonDescription: cancelReasonDescription || "",
      releaseFundStatus: "Approved",
    });
    console.log("Contract updated -> Canceled");

    console.log("=== [EscrowService.refundToClient] END ===");
    return updatedEscrow as IEscrow;
  }

  async processFreelancerPaymentRequest(
    contractId: string,
    freelancerId: string
  ): Promise<IEscrow> {
    console.log("=== [EscrowService.processFreelancerPaymentRequest] START ===");
    console.log("contractId:", contractId, "freelancerId:", freelancerId);

    const contract = await this._contractRepository.getContractById(contractId);
    console.log("Contract lookup:", contract);

    if (!contract) {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
    }

    if (contract.freelancerId.toString() !== freelancerId) {
      console.error("Freelancer mismatch!");
      throw createHttpError(HttpStatus.FORBIDDEN, Messages.ACCESS_DENIED);
    }

    if (contract.status !== "Canceled") {
      console.warn("Invalid payment request. Contract not canceled:", contract.status);
      throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PAYMENT_REQUEST_NOT_VALID);
    }

    const escrow = await this._escrowRepository.findOne({
      contractId: new mongoose.Types.ObjectId(contractId),
      status: "funded",
    });
    console.log("Escrow lookup:", escrow);

    if (!escrow) {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.ESCROW_NOT_FOUND);
    }

    const paymentAmount = escrow.freelancerEarning * 0.5;
    console.log("Calculated partial paymentAmount:", paymentAmount);

    const freelancerWallet = await this._walletRepository.addFunds(
      freelancerId,
      paymentAmount,
      "Partial contract payment for canceled contract",
      "credit"
    );
    console.log("Freelancer wallet updated:", freelancerWallet);

    const updatedEscrow = await this._escrowRepository.findByIdAndUpdate(
      escrow._id!.toString(),
      {
        status: "released",
        freelancerEarning: paymentAmount,
        updatedAt: new Date(),
      }
    );
    console.log("Escrow updated -> released:", updatedEscrow);

    console.log("=== [EscrowService.processFreelancerPaymentRequest] END ===");
    return updatedEscrow as IEscrow;
  }

  async getAdminTransactions(): Promise<IEscrow[]> {
    try {
      console.log("[EscrowService] getAdminTransactions called");
      return await this._escrowRepository.getAdminTransactions();
    } catch (error) {
      console.error("[EscrowService] getAdminTransactions failed:", error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, Messages.FAILED);
    }
  }

  async getMonthlySalesReport(): Promise<any[]> {
    console.log("[EscrowService] getMonthlySalesReport called");
    return this._escrowRepository.getMonthlySalesReport();
  }
}
