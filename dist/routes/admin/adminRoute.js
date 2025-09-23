"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryRoutes_1 = __importDefault(require("../../routes/admin/categoryRoutes"));
const skillsRoutes_1 = __importDefault(require("../../routes/admin/skillsRoutes"));
const handleUsersRoute_1 = __importDefault(require("../../routes/admin/handleUsersRoute"));
const escrowRoutes_1 = __importDefault(require("../../routes/admin/escrowRoutes"));
const router = express_1.default.Router();
router.use('/categories', categoryRoutes_1.default);
router.use('/skills', skillsRoutes_1.default);
router.use('/users', handleUsersRoute_1.default);
router.use('/escrow', escrowRoutes_1.default);
exports.default = router;
