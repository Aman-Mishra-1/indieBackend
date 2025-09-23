"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
const createHttpError = (statusCode, message) => {
    return new HttpError(message, statusCode);
};
exports.createHttpError = createHttpError;
