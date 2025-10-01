import mongoose, { UpdateQuery } from "mongoose";
import { IWalletRepository } from "../../interfaces/admin/wallet/IWalletRepository";
import Wallet, { IWallet } from "../../models/user/walletModel";
import { BaseRepository } from "../base/baseRepository";

export class WalletRepository
  extends BaseRepository<IWallet>
  implements IWalletRepository
{
  constructor() {
    super(Wallet);
  }

  async addFunds(
    userId: string,
    amount: number,
    description: string,
    type: "credit" | "debit",
    contractId?: string
  ): Promise<IWallet> {
    console.log("=== [WalletRepository.addFunds] START ===");
    console.log("Input params:", { userId, amount, description, type, contractId });

    let wallet = (await this.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    })) as IWallet | null;

    if (!wallet) {
      console.log("No wallet found for user. Creating new wallet...");
      wallet = (await this.create({
        userId: new mongoose.Types.ObjectId(userId),
        balance: 0,
        transactions: [],
      })) as IWallet;
      console.log("New wallet created:", wallet._id.toString());
    } else {
      console.log("Existing wallet found:", {
        walletId: wallet._id.toString(),
        currentBalance: wallet.balance,
        transactionsCount: wallet.transactions?.length || 0,
      });
    }

    const newBalance =
      type === "credit" ? wallet.balance + amount : wallet.balance - amount;

    console.log("Calculated new balance:", newBalance);

    const transaction = {
      amount,
      description,
      type,
      date: new Date(),
      ...(contractId && {
        contractId: new mongoose.Types.ObjectId(contractId),
      }),
    };

    console.log("Appending transaction:", transaction);

    const updated = (await this.findByIdAndUpdate(
      wallet._id.toString(),
      {
        $set: { balance: newBalance },
        $push: { transactions: transaction },
      } as UpdateQuery<IWallet>,
      { new: true }
    )) as IWallet;

    console.log("Updated wallet:", {
      walletId: updated._id?.toString(),
      newBalance: updated.balance,
      transactionsCount: updated.transactions?.length || 0,
    });

    console.log("=== [WalletRepository.addFunds] END ===");

    return updated;
  }

  async getUserTransactions(walletId: string): Promise<any[]> {
    const objectId = new mongoose.Types.ObjectId(walletId);

    const transactions = await this.model.aggregate([
      { $match: { _id: objectId } },
      { $unwind: "$transactions" },
      {
        $lookup: {
          from: "contracts",
          localField: "transactions.contractId",
          foreignField: "_id",
          as: "contract",
        },
      },
      { $unwind: { path: "$contract", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "contract.clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          amount: "$transactions.amount",
          type: "$transactions.type",
          description: "$transactions.description",
          date: "$transactions.date",
          contractId: "$transactions.contractId",
          clientName: { $ifNull: ["$client.name", null] },
        },
      },
      { $sort: { date: -1 } },
    ]);

    return transactions;
  }

  async userSalesReport(userId: string): Promise<any[]> {
    return Wallet.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
        },
      },
      {
        $unwind: "$transactions",
      },
      {
        $match: {
          "transactions.type": "credit",
          "transactions.contractId": { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$transactions.date" },
            month: { $month: "$transactions.date" },
          },
          totalRevenue: { $sum: "$transactions.amount" },
          totalTransactions: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          totalRevenue: 1,
          totalTransactions: 1,
        },
      },
    ]);
  }
}
