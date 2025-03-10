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
exports.connection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/*const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}; */
const dbConfig = {
    host: "maglev.proxy.rlwy.net",
    port: 11532,
    user: "root",
    password: "siPUjvftfBfJyaYnZnZnaHAGvjGzUbIY",
    database: "supermarket_db",
};
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MySQL
        exports.connection = yield promise_1.default.createConnection(dbConfig);
        console.log("✅ MySQL Connected!");
        // Fetch all products
        // Insert a sample product
        // Fetch sales data
        const [sales] = yield exports.connection.execute("SELECT * FROM sales");
        console.log("💰 Sales Data:", sales);
        // Close connection
        /*   await connection.end();
           console.log("🔌 Connection Closed."); */
    }
    catch (error) {
        console.error("❌ MySQL Error:", error);
    }
});
exports.default = dbConnect;
