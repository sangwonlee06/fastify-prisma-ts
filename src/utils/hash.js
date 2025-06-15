"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const hashPassword = (password) => {
    const salt = crypto_1.default.randomBytes(16).toString('hex');
    const hash = crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { hash, salt };
};
exports.hashPassword = hashPassword;
const verifyPassword = ({ candidatePassword, salt, hash, }) => {
    const candidateHash = crypto_1.default
        .pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512')
        .toString('hex');
    return candidateHash === hash;
};
exports.verifyPassword = verifyPassword;
