"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype); // Ensure instanceof works
    }
}
exports.default = ResponseError;
