"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsResponseSchema = exports.productResponseSchema = exports.createProductSchema = exports.productGenerated = exports.productInput = void 0;
const zod_1 = require("zod");
exports.productInput = {
    title: zod_1.z.string(),
    price: zod_1.z.number(),
    content: zod_1.z.string().optional(),
};
exports.productGenerated = {
    id: zod_1.z.number(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
};
exports.createProductSchema = zod_1.z.object(Object.assign({}, exports.productInput));
exports.productResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, exports.productInput), exports.productGenerated));
exports.productsResponseSchema = zod_1.z.array(exports.productResponseSchema);
