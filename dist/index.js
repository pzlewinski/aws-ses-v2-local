"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const sendRawEmail_1 = __importDefault(require("./v1/sendRawEmail"));
const sendEmail_1 = __importDefault(require("./v1/sendEmail"));
const createEmailTemplate_1 = __importDefault(require("./v2/createEmailTemplate"));
const deleteEmailTemplate_1 = __importDefault(require("./v2/deleteEmailTemplate"));
const getAccount_1 = __importDefault(require("./v2/getAccount"));
const sendEmail_2 = __importDefault(require("./v2/sendEmail"));
const sendBulkEmail_1 = __importDefault(require("./v2/sendBulkEmail"));
const store_1 = require("./store");
exports.defaultConfig = {
    host: 'localhost',
    port: 8005,
};
const server = (partialConfig = {}) => {
    const config = {
        ...exports.defaultConfig,
        ...partialConfig,
    };
    const app = (0, express_1.default)();
    app.use(express_1.default.json({ limit: '25mb' }));
    app.use(express_1.default.urlencoded({ extended: false, limit: '25mb' }));
    app.get('/', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../static/index.html'));
    });
    app.post('/clear-store', (req, res) => {
        (0, store_1.clearStore)();
        res.status(200).send({ message: 'Store cleared' });
    });
    app.get('/store', (req, res) => {
        const store = (0, store_1.getStoreReadonly)();
        if (!req.query.since) {
            res.status(200).send(store);
            return;
        }
        if (typeof req.query.since !== 'string') {
            res.status(400).send({ message: 'Bad since query param, expected single value' });
        }
        const since = parseInt(req.query.since, 10);
        if (Number.isNaN(since) || req.query.since !== String(since)) {
            res.status(400).send({ message: 'Bad since query param, expected integer representing epoch timestamp in seconds' });
        }
        res.status(200).send({ ...store, emails: store.emails.filter((e) => e.at >= since) });
    });
    app.get('/health-check', (req, res) => {
        res.status(200).send();
    });
    app.use((req, res, next) => {
        const authHeader = req.header('authorization');
        if (!authHeader) {
            res.status(403).send({ message: 'Missing Authentication Token', detail: 'aws-ses-v2-local: Must provide some type of authentication, even if only a mock access key' });
            return;
        }
        if (!authHeader.startsWith('AWS')) {
            res.status(400).send({ message: 'Not Authorized', detail: 'aws-ses-v2-local: Authorization type must be AWS' });
            return;
        }
        next();
    });
    app.post('/', (req, res, next) => {
        if (req.body.Action === 'SendEmail')
            (0, sendEmail_1.default)(req, res, next);
        if (req.body.Action === 'SendRawEmail')
            (0, sendRawEmail_1.default)(req, res, next);
    });
    // SES V2 - template handling.
    app.post('/v2/email/templates', createEmailTemplate_1.default);
    app.delete('/v2/email/templates/:TemplateName', deleteEmailTemplate_1.default);
    // SES V2 - account handling.
    app.get('/v2/email/account', getAccount_1.default);
    // SES V2 - email sending.
    app.post('/v2/email/outbound-emails', sendEmail_2.default);
    app.post('/v2/email/outbound-bulk-emails', sendBulkEmail_1.default);
    app.use((req, res) => {
        res.status(404).send('<UnknownOperationException/>');
    });
    return new Promise((resolve) => {
        const s = app.listen(config.port, config.host, () => resolve(s));
    });
};
exports.default = server;
