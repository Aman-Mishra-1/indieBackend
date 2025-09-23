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
exports.ReviewService = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
class ReviewService {
    constructor(_reviewRepository, _contractRepository) {
        this._reviewRepository = _reviewRepository;
        this._contractRepository = _contractRepository;
    }
    ;
    createReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contractId, clientId, freelancerId, rating, description } = reviewData;
            const contract = yield this._contractRepository.getContractById(contractId);
            if (!contract) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CONTRACT_NOT_FOUND);
            }
            if (contract.clientId.toString() !== clientId) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.FORBIDDEN, messageConstants_1.Messages.ACCESS_DENIED);
            }
            if (contract.status !== 'Completed') {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, 'Cannot review until contract is completed');
            }
            ;
            const existingReview = yield this._reviewRepository.getReviewByContract(contractId);
            if (existingReview) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.BAD_REQUEST, 'Review already exists for this contract');
            }
            ;
            return yield this._reviewRepository.createReview({
                contractId,
                clientId,
                freelancerId,
                rating,
                description,
                isDeleted: false
            });
        });
    }
    ;
    getReviewsByFreelancer(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._reviewRepository.getReviewsByFreelancer(freelancerId);
        });
    }
}
exports.ReviewService = ReviewService;
