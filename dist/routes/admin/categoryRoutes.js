"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../../controllers/admin/categoryController");
const categoryService_1 = require("../../services/admin/categoryService");
const categoryRepository_1 = require("../../repository/admin/categoryRepository");
const authMiddleware_1 = require("../../middlewares/authMiddleware"); // Import middleware
const router = express_1.default.Router();
const categoryRepository = new categoryRepository_1.CategoryRepository();
const categoryService = new categoryService_1.CategoryService(categoryRepository);
const categoryController = new categoryController_1.CategoryController(categoryService);
router.post('/add-category', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), categoryController.addCategory.bind(categoryController));
router.put('/edit-category/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), categoryController.editCategory.bind(categoryController));
router.get('/get-categories', categoryController.getCategory.bind(categoryController));
router.put('/list-category/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), categoryController.listCategory.bind(categoryController));
router.put('/unlist-category/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('admin'), categoryController.unlistCategory.bind(categoryController));
exports.default = router;
