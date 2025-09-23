"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewRepository_1 = require("../../repository/client/reviewRepository");
const contractRepository_1 = require("../../repository/client/contractRepository");
const reviewService_1 = require("../../services/client/reviewService");
const reviewController_1 = require("../../controllers/client/reviewController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
const reviewRepository = new reviewRepository_1.ReviewRepository();
const contractRepository = new contractRepository_1.ContractRepository();
const reviewService = new reviewService_1.ReviewService(reviewRepository, contractRepository);
const reviewController = new reviewController_1.ReviewController(reviewService);
router.post("/rate-freelancer/:clientId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('client'), reviewController.createReview.bind(reviewController));
router.get("/show-reviews/:freelancerId", reviewController.getReviewsByFreelancer.bind(reviewController));
exports.default = router;
