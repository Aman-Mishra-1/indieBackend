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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// 🔹 Replace with your Railway MongoDB URI
var MONGO_URI = "mongodb+srv://am1807152_db_user:FKfcR6wAo3nmhtQA@cluster0.gkjt4vm.mongodb.net/?retryWrites=true&w=majority&appName=Skillo";
// 🔹 Replace with your test IDs
var ESCROW_ID = "68d5374eec58bf2065f06309";
var FREELANCER_ID = "68d2b5e56824632a93487ced";
var CLIENT_ID = "68d2bbc56824632a93487cfa";
var CONTRACT_ID = "68d40de93d7ab6fbf0e14b46";
function checkData() {
    return __awaiter(this, void 0, void 0, function () {
        var db, escrow, freelancerWallet, clientWallet, contract, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, mongoose_1.default.connect(MONGO_URI)];
                case 1:
                    _a.sent();
                    console.log("✅ Connected to MongoDB");
                    db = mongoose_1.default.connection.db;
                    return [4 /*yield*/, db.collection("escrows").findOne({
                            _id: new mongoose_1.default.Types.ObjectId(ESCROW_ID),
                        })];
                case 2:
                    escrow = _a.sent();
                    console.log("\n📌 Escrow document:");
                    console.log(escrow);
                    return [4 /*yield*/, db.collection("wallets").findOne({
                            userId: new mongoose_1.default.Types.ObjectId(FREELANCER_ID),
                        })];
                case 3:
                    freelancerWallet = _a.sent();
                    console.log("\n📌 Freelancer wallet:");
                    console.log(freelancerWallet);
                    return [4 /*yield*/, db.collection("wallets").findOne({
                            userId: new mongoose_1.default.Types.ObjectId(CLIENT_ID),
                        })];
                case 4:
                    clientWallet = _a.sent();
                    console.log("\n📌 Client wallet:");
                    console.log(clientWallet);
                    return [4 /*yield*/, db.collection("contracts").findOne({
                            _id: new mongoose_1.default.Types.ObjectId(CONTRACT_ID),
                        })];
                case 5:
                    contract = _a.sent();
                    console.log("\n📌 Contract document:");
                    console.log(contract);
                    // 5️⃣ Show all transactions in freelancer wallet (if any)
                    if (freelancerWallet) {
                        console.log("\n📌 Freelancer wallet transactions:");
                        console.log(freelancerWallet.transactions || []);
                    }
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 6:
                    _a.sent();
                    console.log("\n✅ Done");
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    console.error("❌ Error checking data:", err_1);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
checkData();
