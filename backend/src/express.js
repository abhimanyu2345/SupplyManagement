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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = require("body-parser");
const db_1 = require("./db/db");
const cors_config = {
    origin: process.env.STATUS === "production" ? "    " : 'http://localhost:5173',
    credentials: true,
};
const server = (0, express_1.default)();
server.use((0, cors_1.default)(cors_config));
server.use((0, cookie_parser_1.default)());
server.use((0, body_parser_1.json)());
// ✅ GET: Fetch all products
server.get("/fetch_products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [products] = yield db_1.connection.execute("SELECT * FROM products");
        console.log("📦 Products:", products);
        res.status(200).json(products);
    }
    catch (err) {
        console.error("❌ Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
}));
server.post("/add_stock", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty product list" });
        }
        for (const product of products) {
            const { id, no } = product;
            // Update stock
            yield db_1.connection.execute("UPDATE products SET stock = stock + ? WHERE id = ?", [no, id]);
        }
        const [updatedProduct] = yield db_1.connection.execute("SELECT * FROM products WHERE id");
        res.status(200).json({ message: "Stock added successfully", stoke: updatedProduct });
    }
    catch (err) {
        console.error("❌ Add Stock Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
}));
server.post("/remove_stock", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = req.body.cart;
        console.log(products);
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty product list" });
        }
        const remainingProducts = [];
        for (const product of products) {
            const { id, quantity } = product;
            // Fetch current stock
            const [rows] = yield db_1.connection.execute("SELECT stock,price FROM products WHERE id = ?", [id]);
            if (rows.length === 0) {
                remainingProducts.push(product); // Product not found
                continue;
            }
            let currentStock = rows[0].stock;
            let price = rows[0].price;
            let newStock = currentStock - quantity;
            // If stock would go negative, add to remaining list
            if (newStock < 0) {
                remainingProducts.push(product);
                continue;
            }
            // Update stock
            yield db_1.connection.execute("UPDATE products SET stock = ? WHERE id = ?", [newStock, id]);
            // Insert into sales table (recording the sale)
            yield db_1.connection.execute("INSERT INTO sales (product_id, quantity, total_price, sale_date) VALUES (?, ?, ?, NOW())", [id, quantity, price * quantity] // Total price = price * quantity
            );
        }
        const [productList] = yield db_1.connection.execute("SELECT * FROM products");
        res.status(200).json({
            message: "Stock updated successfully",
            stoke: productList
        });
    }
    catch (err) {
        console.error("❌ Remove Stock Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
}));
const startExpress = () => {
    server.listen(8080, () => {
        console.log("Express is available");
    });
};
exports.default = startExpress;
