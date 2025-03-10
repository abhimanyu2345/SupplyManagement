import mysql from "mysql2/promise";

import dotenv from "dotenv";
import startExpress from "./express";
dotenv.config();

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
export  var connection:mysql.Connection ; 
const dbConnect=async () => {
  try {
    // Connect to MySQL
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ MySQL Connected!");

    // Fetch all products
    

    // Insert a sample product
    

    // Fetch sales data
    const [sales] = await connection.execute("SELECT * FROM sales");
    console.log("💰 Sales Data:", sales);

    // Close connection
 /*   await connection.end();
    console.log("🔌 Connection Closed."); */
  } catch (error) {
    console.error("❌ MySQL Error:", error);
  }
};


export default dbConnect;