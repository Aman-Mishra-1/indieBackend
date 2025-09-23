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
exports.ReviewController = void 0;
const statusContstants_1 = require("../../constants/statusContstants");
const messageConstants_1 = require("../../constants/messageConstants");
class ReviewController {
    constructor(_reviewService) {
        this._reviewService = _reviewService;
    }
    createReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contractId, freelancerId, rating, description } = req.body;
                const { clientId } = req.params;
                if (!contractId || !freelancerId || !rating || !description) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.MISSING_PARAMETERS });
                    return;
                }
                const review = yield this._reviewService.createReview({
                    contractId,
                    clientId,
                    freelancerId,
                    rating,
                    description
                });
                res.status(statusContstants_1.HttpStatus.CREATED).json({
                    message: messageConstants_1.Messages.REVIEW_CREATED,
                    data: review
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getReviewsByFreelancer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerId } = req.params;
                if (!freelancerId) {
                    res.status(statusContstants_1.HttpStatus.BAD_REQUEST).json({ message: messageConstants_1.Messages.ID_REQUIRED });
                    return;
                }
                const reviews = yield this._reviewService.getReviewsByFreelancer(freelancerId);
                res.status(statusContstants_1.HttpStatus.OK).json({
                    count: reviews.length,
                    data: reviews
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
exports.ReviewController = ReviewController;
