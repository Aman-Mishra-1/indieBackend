"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.morganMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const transport = new winston_1.default.transports.DailyRotateFile({
    filename: "logs/%DATE%-requests.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
});
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [transport],
});
exports.logger = logger;
// Morgan
const morganMiddleware = (0, morgan_1.default)("combined", {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
});
exports.morganMiddleware = morganMiddleware;
