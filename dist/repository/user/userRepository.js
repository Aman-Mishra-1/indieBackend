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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userModel_1 = require("../../models/user/userModel");
const baseRepository_1 = require("../../repository/base/baseRepository");
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(userModel_1.User);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ email });
        });
    }
    updatePassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ email }, { password: hashedPassword });
        });
    }
}
exports.UserRepository = UserRepository;
