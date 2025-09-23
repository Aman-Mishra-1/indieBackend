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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const env_config_1 = require("./env.config");
cloudinary_1.v2.config({
    cloud_name: env_config_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_config_1.env.CLOUDINARY_API_KEY,
    api_secret: env_config_1.env.CLOUDINARY_API_SECRET
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const isVideo = file.mimetype.startsWith('video/');
        return Object.assign({ folder: isVideo ? 'uploads/videos' : 'uploads/images', format: file.mimetype.split('/')[1], resource_type: isVideo ? 'video' : 'image' }, (isVideo ? {} : {
            transformation: [{ width: 500, height: 500, crop: "limit" }]
        }));
    })
});
// Add file filter to restrict file types
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if ([...allowedImageTypes, ...allowedVideoTypes].includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
};
// Configure multer with size limits
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
    }
});
exports.default = upload;
