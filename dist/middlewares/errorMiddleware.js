"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const httpError_1 = require("../utils/httpError");
const messageConstants_1 = require("../constants/messageConstants");
const statusContstants_1 = require("../constants/statusContstants");
const errorHandler = (err, req, res, next) => {
    console.log("Error caught in ERROR MIDDLEWARE :", err);
    let statusCode = statusContstants_1.HttpStatus.INTERNAL_SERVER_ERROR || 500;
    let message = messageConstants_1.Messages.SERVER_ERROR;
    if (err instanceof httpError_1.HttpError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        console.log('Unhanled', err);
    }
    res.status(statusCode).json({ error: message });
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    next(new httpError_1.HttpError(messageConstants_1.Messages.INVALID_REQUEST, statusContstants_1.HttpStatus.NOT_FOUND));
};
exports.notFound = notFound;
