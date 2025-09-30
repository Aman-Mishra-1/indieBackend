import mongoose from "mongoose";

// 🔹 Replace with your Railway MongoDB URI
const MONGO_URI = "mongodb+srv://am1807152_db_user:FKfcR6wAo3nmhtQA@cluster0.gkjt4vm.mongodb.net/?retryWrites=true&w=majority&appName=Skillo";

// 🔹 Replace with your test IDs
const ESCROW_ID = "68d5374eec58bf2065f06309";
const FREELANCER_ID = "68d2b5e56824632a93487ced";
const CLIENT_ID = "68d2bbc56824632a93487cfa";
const CONTRACT_ID = "68d40de93d7ab6fbf0e14b46";

async function checkData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;

    // 1️⃣ Check escrow by _id
    const escrow = await db.collection("escrows").findOne({
      _id: new mongoose.Types.ObjectId(ESCROW_ID),
    });
    console.log("\n📌 Escrow document:");
    console.log(escrow);

    // 2️⃣ Check freelancer wallet
    const freelancerWallet = await db.collection("wallets").findOne({
      userId: new mongoose.Types.ObjectId(FREELANCER_ID),
    });
    console.log("\n📌 Freelancer wallet:");
    console.log(freelancerWallet);

    // 3️⃣ Check client wallet
    const clientWallet = await db.collection("wallets").findOne({
      userId: new mongoose.Types.ObjectId(CLIENT_ID),
    });
    console.log("\n📌 Client wallet:");
    console.log(clientWallet);

    // 4️⃣ Check contract
    const contract = await db.collection("contracts").findOne({
      _id: new mongoose.Types.ObjectId(CONTRACT_ID),
    });
    console.log("\n📌 Contract document:");
    console.log(contract);

    // 5️⃣ Show all transactions in freelancer wallet (if any)
    if (freelancerWallet) {
      console.log("\n📌 Freelancer wallet transactions:");
      console.log(freelancerWallet.transactions || []);
    }

    await mongoose.disconnect();
    console.log("\n✅ Done");
  } catch (err) {
    console.error("❌ Error checking data:", err);
    process.exit(1);
  }
}

checkData();
