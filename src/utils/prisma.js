"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const prisma_1 = require("../generated/prisma");
exports.db = globalThis.prisma || new prisma_1.PrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalThis.prisma = exports.db;
