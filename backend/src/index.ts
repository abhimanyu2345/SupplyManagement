import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";

// MySQL Connection
const db = await mysql.createConnection({
  host: "maglev.proxy.rlwy.net",
  port: 11532,
  user: "root",
  password: "siPUjvftfBfJyaYnZnZnaHAGvjGzUbIY",
  database: "railway",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ 1. Get All Products
app.get("/products", async (req, res) => {
  try {
    const [products] = await db.execute("SELECT * FROM products");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 2. Add New Product (Admin Only)
app.post("/products", async (req, res) => {
  try {
    const { name, category, price, stock, expiry_date, barcode } = req.body;
    const [result] = await db.execute(
      "INSERT INTO products (name, category, price, stock, expiry_date, barcode) VALUES (?, ?, ?, ?, ?, ?)",
      [name, category, price, stock, expiry_date, barcode]
    );
    res.json({ message: "Product added!", productId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 3. Purchase Product (Reduce Stock)
app.post("/purchase", async (req, res) => {
  try {
    const { product_id, quantity, cashier } = req.body;

    // Get product info
    const [product] = await db.execute("SELECT * FROM products WHERE id = ?", [product_id]);

    if (product.length === 0) return res.status(404).json({ message: "Product not found!" });
    if (product[0].stock < quantity) return res.status(400).json({ message: "Not enough stock!" });

    // Update stock
    await db.execute("UPDATE products SET stock = stock - ? WHERE id = ?", [quantity, product_id]);

    // Add sale record
    const total_price = product[0].price * quantity;
    await db.execute(
      "INSERT INTO sales (product_id, quantity, total_price, cashier) VALUES (?, ?, ?, ?)",
      [product_id, quantity, total_price, cashier]
    );

    // Track stock movement
    await db.execute(
      "INSERT INTO stock_movements (product_id, change_type, quantity) VALUES (?, 'OUT', ?)",
      [product_id, quantity]
    );

    res.json({ message: "Purchase successful!", total_price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 4. Restock Product (Admin Only)
app.post("/restock", async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Update stock
    await db.execute("UPDATE products SET stock = stock + ? WHERE id = ?", [quantity, product_id]);

    // Track stock movement
    await db.execute(
      "INSERT INTO stock_movements (product_id, change_type, quantity) VALUES (?, 'IN', ?)",
      [product_id, quantity]
    );

    res.json({ message: "Product restocked!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 5. Get All Sales (Admin Only)
app.get("/sales", async (req, res) => {
  try {
    const [sales] = await db.execute("SELECT * FROM sales");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 6. Get Stock Movements
app.get("/stock-movements", async (req, res) => {
  try {
    const [movements] = await db.execute("SELECT * FROM stock_movements");
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 7. Get Users (Admin Only)
app.get("/users", async (req, res) => {
  try {
    const [users] = await db.execute("SELECT id, username, role FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 8. Create User (Admin Only)
app.post("/users", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    await db.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );

    res.json({ message: "User created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 9. Delete Product (Admin Only)
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 10. Delete Sale (Admin Only)
app.delete("/sales/:id", async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM sales WHERE id = ?", [id]);
    res.json({ message: "Sale deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
