"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contact = exports.organization = exports.user = exports.saveProject = exports.project = exports.check = void 0;
const cors_1 = __importDefault(require("cors"));
const functions = __importStar(require("firebase-functions/v1"));
const nodemailer = __importStar(require("nodemailer"));
const database_1 = require("./controllers/database");
const ResponseError_1 = __importDefault(require("./model/ResponseError"));
const getOrigin = () => {
    const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];
    if (process.env.NODE_ENV === 'development') {
        console.log('Running in development mode');
        const devOrigins = Object.keys(process.env)
            .filter((key) => key.startsWith('DEV_CORS_ORIGIN'))
            .map((key) => process.env[key])
            .filter(Boolean);
        return devOrigins.length > 0 ? devOrigins : defaultOrigins;
    }
    else {
        console.log('Running in production mode');
        const prodOrigins = Object.keys(process.env)
            .filter((key) => key.startsWith('CORS_ORIGIN'))
            .map((key) => process.env[key])
            .filter(Boolean);
        return prodOrigins.length > 0
            ? prodOrigins
            : process.env.CORS_ORIGIN
                ? [process.env.CORS_ORIGIN]
                : defaultOrigins;
    }
};
const printCORSOrigin = (url) => {
    console.log(`Server is now accepting request from ${url}`);
};
const origin = getOrigin();
if (Array.isArray(origin) && origin.length > 0) {
    origin.forEach((url) => {
        printCORSOrigin(url);
    });
}
if (typeof origin === 'string') {
    printCORSOrigin(origin);
}
const corsOptions = {
    origin: origin,
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Refresh-Token'],
};
const cors = (0, cors_1.default)(corsOptions);
exports.check = functions.https.onRequest(async (req, res) => {
    try {
        console.log(req);
        // await checkToken(req);
        res.json({ success_message: 'Token is valid.' });
    }
    catch (error) {
        const err = error;
        res.json({
            error_message: err.message,
            status_code: err.statusCode,
        });
    }
});
exports.project = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const projectID = req.params[0];
            const data = await (0, database_1.getData)('portfolio', projectID);
            if (data === null) {
                throw new ResponseError_1.default(`${projectID} could not be found.`, 404);
            }
            res.json({ data: data });
        }
        catch (error) {
            const err = error;
            res.json({
                error_message: err.message,
                status_code: err.statusCode,
            });
        }
    });
});
exports.saveProject = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const id = req.params[0];
            let repoURL = null;
            if (req.body.process) {
                repoURL = req.body.process.development.repo_url;
            }
            const data = await (0, database_1.postData)('portfolio', id, req.body);
            if (!data) {
                throw new ResponseError_1.default(`Project with the #ID: ${id} could not be updated.`, 400);
            }
            res.json({
                id: id,
                repo_url: repoURL,
                success_message: `Project with the #ID: ${id} was updated at ${data}.`,
            });
        }
        catch (error) {
            const err = error;
            res.json({
                error_message: err.message,
                status_code: err.statusCode,
            });
        }
    });
});
exports.user = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const id = req.params[0];
            const data = await (0, database_1.getData)('user', id);
            if (data === null) {
                throw new ResponseError_1.default(`${id} could not be found.`, 404);
            }
            res.json({ data: data });
        }
        catch (error) {
            const err = error;
            res.json({
                error_message: err.message,
                status_code: err.statusCode,
            });
        }
    });
});
exports.organization = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const id = req.params[0];
            const data = await (0, database_1.getData)('organization', id);
            if (data === null) {
                throw new ResponseError_1.default(`${id} could not be found.`, 404);
            }
            res.json({ data: data });
        }
        catch (error) {
            const err = error;
            res.json({
                error_message: err.message,
                status_code: err.statusCode,
            });
        }
    });
});
exports.contact = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const body = req.body ?? null;
            let errorMessage = "";
            let successMessage = null;
            if (body == null) {
                errorMessage = "First name, last name, email, subject and message is required.";
            }
            const { contact_first_name, contact_last_name, contact_email, contact_subject, contact_message } = req.body;
            const firstName = contact_first_name?.trim ? contact_first_name : null;
            const lastName = contact_last_name?.trim ? contact_last_name : null;
            const contactEmail = contact_email?.trim ? contact_email : null;
            const subject = contact_subject?.trim ? contact_subject : null;
            const message = contact_message?.trim ? contact_message : null;
            if (!firstName)
                errorMessage += "First name is required. ";
            if (!lastName)
                errorMessage += "Last name is required. ";
            if (!contactEmail)
                errorMessage += "Email is required. ";
            if (!subject)
                errorMessage += "Subject is required. ";
            if (!message)
                errorMessage += "Message is required.";
            const email = "jamel.c.lyons@gmail.com";
            if (errorMessage == "") {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: email,
                        pass: "oyfs gbev hdqq qznl",
                    },
                });
                const messageSent = await transporter.sendMail({
                    from: contactEmail,
                    to: email,
                    subject,
                    text: message,
                });
                successMessage = messageSent.rejected.length == 0 ? `Your message has been sent successfully ${contact_first_name}, Thank You.` : null;
            }
            res.json({
                success: successMessage,
                error: errorMessage
            });
        }
        catch (error) {
            const err = error;
            res.json({
                error: err.message,
                status_code: err.statusCode,
            });
        }
    });
});
