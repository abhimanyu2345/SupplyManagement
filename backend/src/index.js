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
const promise_1 = __importDefault(require("mysql2/promise"));
const dbConfig = {
    host: "maglev.proxy.rlwy.net",
    port: 11532,
    user: "root",
    password: "siPUjvftfBfJyaYnZnZnaHAGvjGzUbIY",
    database: "supermarket_db",
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MySQL
        const connection = yield promise_1.default.createConnection(dbConfig);
        console.log("✅ MySQL Connected!");
        // Fetch all products
        const [products] = yield connection.execute("SELECT * FROM products");
        console.log("📦 Products:", products);
        // Insert a sample product
        const [insertResult] = yield connection.execute("INSERT INTO products (name, category, price, stock) VALUES ('Banana', 'Fruits', 0.99, 100)");
        console.log("✅ Inserted Product ID:", insertResult.insertId);
        // Fetch sales data
        const [sales] = yield connection.execute("SELECT * FROM sales");
        console.log("💰 Sales Data:", sales);
        // Close connection
        yield connection.end();
        console.log("🔌 Connection Closed.");
    }
    catch (error) {
        console.error("❌ MySQL Error:", error);
    }
}))();
