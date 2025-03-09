import mysql from "mysql2/promise";

const dbConfig = {
  host: "maglev.proxy.rlwy.net",
  port: 11532,
  user: "root",
  password: "siPUjvftfBfJyaYnZnZnaHAGvjGzUbIY",
  database: "supermarket_db",
};

(async () => {
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ MySQL Connected!");

    // Fetch all products
    const [products] = await connection.execute("SELECT * FROM products");
    console.log("📦 Products:", products);

    // Insert a sample product
    const [insertResult] = await connection.execute(
      "INSERT INTO products (name, category, price, stock) VALUES ('Banana', 'Fruits', 0.99, 100)"
    );
    console.log("✅ Inserted Product ID:", insertResult.insertId);

    // Fetch sales data
    const [sales] = await connection.execute("SELECT * FROM sales");
    console.log("💰 Sales Data:", sales);

    // Close connection
    await connection.end();
    console.log("🔌 Connection Closed.");
  } catch (error) {
    console.error("❌ MySQL Error:", error);
  }
})();
