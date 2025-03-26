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
        const { name, quantity } = req.body; // Expecting an array of products
        // Fetch product ID
        const [rows] = yield db_1.connection.execute("SELECT id FROM products WHERE name = ?", [name]);
        if (rows.length === 0) {
            console.warn(`⚠️ Product not found: ${name}`);
            res.status(500).json({ error: `⚠️ Product not found: ${name}` });
            return; // Skip if product doesn't exist
        }
        const productId = rows[0].id;
        // Update stock
        yield db_1.connection.execute("UPDATE products SET stock = stock + ? WHERE id = ?", [quantity, productId]);
        const [updatedProducts] = yield db_1.connection.execute("SELECT * FROM products");
        res.status(200).json({ message: "Stock added successfully", stock: updatedProducts });
    }
    // Fetch updated products
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
            const { product_id, quantity } = product;
            console.log(`${product_id} +${quantity}`);
            // Fetch current stock
            const [rows] = yield db_1.connection.execute("SELECT stock,price FROM products WHERE id = ?", [product_id]);
            if (rows.length === 0) {
                remainingProducts.push(product); // Product not found
                continue;
            }
            let currentStock = rows[0].stock;
            let price = rows[0].price;
            let newStock = currentStock - quantity;
            console.log(currentStock);
            console.log(newStock);
            // If stock would go negative, add to remaining list
            if (newStock < 0) {
                remainingProducts.push(product);
                continue;
            }
            // Update stock
            yield db_1.connection.execute("UPDATE products SET stock = ? WHERE id = ?", [newStock, product_id]);
            // Insert into sales table (recording the sale)
            yield db_1.connection.execute("INSERT INTO sales (product_id, quantity, total_price, sale_date) VALUES (?, ?, ?, NOW())", [product_id, quantity, price * quantity] // Total price = price * quantity
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
//logic for admin
server.get("/fetch_users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users] = yield db_1.connection.execute("SELECT * FROM users");
        console.log("📦 users:", users);
        res.status(200).json(users);
    }
    catch (err) {
        console.error("❌ Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
}));
server.post("/add_user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        // Insert new user (hash password before storing)
        yield db_1.connection.execute("INSERT INTO users (username, password, role) VALUES (?, SHA2(?, 256), ?)", [username, password, role]);
        // Fetch updated users list
        const [users] = yield db_1.connection.execute("SELECT * FROM users");
        console.log("✅ User added:", username);
        res.status(201).json(users);
    }
    catch (err) {
        console.error("❌ Error adding user:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
}));
server.delete("/remove_user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Delete user by ID
        const [result] = yield db_1.connection.execute("DELETE FROM users WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        // Fetch updated users list
        const [users] = yield db_1.connection.execute("SELECT * FROM users");
        console.log("🗑️ User removed:", id);
        res.status(200).json(users);
    }
    catch (err) {
        console.error("❌ Error removing user:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
}));
server.get("/fetch_suppliers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield db_1.connection.query("SELECT * FROM suppliers");
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
// ✅ Remove a supplier by ID
// Remove a supplier by ID
server.delete("/remove_supplier/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [result] = yield db_1.connection.query("DELETE FROM suppliers WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        res.json({ message: "Supplier removed successfully", id });
    }
    catch (err) {
        console.error("Error removing supplier:", err);
        res.status(500).json({ error: "Database error" });
    }
}));
server.post("/add_supplier", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, contact, email, address } = req.body;
    if (!name || !contact || !email || !address) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const [result] = yield db_1.connection.query("INSERT INTO suppliers (name, contact, email, address) VALUES (?, ?, ?, ?)", [name, contact, email, address]);
        const newSupplier = {
            id: result.insertId, // MySQL returns the last inserted ID
            name,
            contact,
            email,
            address,
        };
        res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
    }
    catch (err) {
        console.error("Error adding supplier:", err);
        res.status(500).json({ error: "Database error" });
    }
}));
const startExpress = () => {
    server.listen(8080, () => {
        console.log("Express is available");
    });
};
exports.default = startExpress;
