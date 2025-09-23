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
exports.CategoryService = void 0;
const messageConstants_1 = require("../../constants/messageConstants");
const statusContstants_1 = require("../../constants/statusContstants");
const httpError_1 = require("../../utils/httpError");
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.findAll();
        });
    }
    ;
    addCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedCategoryName = data.name.trim();
            const existingCategory = yield this.categoryRepository.findByName(normalizedCategoryName.toLowerCase());
            if (existingCategory) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.CONFLICT, messageConstants_1.Messages.CATEGORY_EXIST);
            }
            return yield this.categoryRepository.create(Object.assign(Object.assign({}, data), { name: normalizedCategoryName }));
        });
    }
    ;
    editCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.name) {
                const normalizedCategoryName = data.name.trim();
                const existingCategory = yield this.categoryRepository.findByName(normalizedCategoryName.toLowerCase());
                if (existingCategory && existingCategory.id !== id) {
                    throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.CONFLICT, messageConstants_1.Messages.CATEGORY_EXIST);
                }
                data.name = normalizedCategoryName;
            }
            const updatedCategory = yield this.categoryRepository.findByIdAndUpdate(id, data);
            if (!updatedCategory) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CATEGORY_NOT_FOUND);
            }
            return updatedCategory;
        });
    }
    ;
    listCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findByIdAndUpdate(id, { isListed: true });
            if (!category) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CATEGORY_NOT_FOUND);
            }
        });
    }
    ;
    unlistCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findByIdAndUpdate(id, { isListed: false });
            if (!category) {
                throw (0, httpError_1.createHttpError)(statusContstants_1.HttpStatus.NOT_FOUND, messageConstants_1.Messages.CATEGORY_NOT_FOUND);
            }
        });
    }
    ;
}
exports.CategoryService = CategoryService;
