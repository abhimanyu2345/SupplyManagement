"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db/db"));
const express_1 = __importDefault(require("./express"));
(0, db_1.default)();
(0, express_1.default)();
