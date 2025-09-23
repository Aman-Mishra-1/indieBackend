"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileRepository_1 = require("../../repository/freelancer/profileRepository");
const profileService_1 = require("../../services/freelancer/profileService");
const profileController_1 = require("../../controllers/freelancer/profileController");
const multer_1 = __importDefault(require("../../config/multer"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
const profileRepository = new profileRepository_1.ProfileRepository();
const profileService = new profileService_1.ProfileService(profileRepository);
const profileController = new profileController_1.ProfileController(profileService);
router.get("/get-profile/:id", profileController.getProfile.bind(profileController));
router.put("/update-profile/:id", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('freelancer'), profileController.updateProfile.bind(profileController));
router.post("/upload-image/:id", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)('freelancer'), multer_1.default.single("profilePic"), profileController.uploadProfileImage.bind(profileController));
exports.default = router;
