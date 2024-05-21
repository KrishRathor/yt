"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
const createFileName = (filename) => {
    return filename.replace(/ /g, '_') + (0, uuid_1.v4)();
};
const s3 = new client_s3_1.S3Client({
    region: (_a = process.env.AWS_REGION) !== null && _a !== void 0 ? _a : '',
    credentials: {
        accessKeyId: (_b = process.env.AWS_ACCESS_KEY) !== null && _b !== void 0 ? _b : '',
        secretAccessKey: (_c = process.env.AWS_SECRET_KEY) !== null && _c !== void 0 ? _c : ''
    }
});
const storage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: 'ytvideoraw',
    key: function (req, file, cb) {
        cb(null, createFileName(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.use(express_1.default.static('uploads'));
app.get('/', (_req, res) => {
    res.send('Hello World!');
});
app.post('/upload/video', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            console.log('i cam here');
            return res.status(400).json({
                message: 'no file provided',
                url: null
            });
        }
        // from here send a video to queue
        // from there to an encoding service which makes segments of videos in multiple resolution
        // then store this to s3
        // encoding service can be a route here only, i don't think we need separate service for it
        console.log(process.env.AWS_SECRET_KEY);
        console.log('i didnt came here', req.file);
        res.status(201).json({
            message: 'File uploaded successfully',
            url: null
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error uploading file.');
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
