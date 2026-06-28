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
exports.auth = exports.db = exports.ADMIN_UID = void 0;
const admin = __importStar(require("firebase-admin"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ADMIN_UID = process.env.ADMIN_UID ?? '';
const projectId = process.env.PROJECT_ID ?? '';
const clientEmail = process.env.CLIENT_EMAIL ?? '';
const privateKey = process.env.PRIVATE_KEY ?? '';
const serviceAccount = {
    projectId: projectId,
    clientEmail: clientEmail,
    privateKey: privateKey,
};
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
});
exports.db = (0, firestore_1.getFirestore)();
exports.auth = admin.auth();
