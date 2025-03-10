import express, { Response, response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import { connection } from './db/db';
import { product } from '../constants';



const cors_config ={

    origin:process.env.STATUS==="production"?"    ":'http://localhost:5173',
    credentials:true,
    
}

const server = express();
server.use(cors(cors_config));
server.use(cookieParser());
server.use(json());

// ✅ GET: Fetch all products
server.get("/fetch_products", async (req: Request, res: Response) => {
    try {
        const [products] = await connection.execute("SELECT * FROM products");
        console.log("📦 Products:", products);
        res.status(200).json(products);
    } catch (err) {
        console.error("❌ Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
});

server.post("/add_stock", async (req: Request, res: Response) => {
    try {
        const products:product = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty product list" });
        }

        for (const product of products) {
            const { id, no } = product;

            // Update stock
          await connection.execute("UPDATE products SET stock = stock + ? WHERE id = ?", [no, id]);
         
        }
        const [updatedProduct] = await connection.execute(
            "SELECT * FROM products WHERE id"
        );

        res.status(200).json({ message: "Stock added successfully",stoke:updatedProduct });
    } catch (err) {
        console.error("❌ Add Stock Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
});




server.post("/remove_stock", async (req: Request, res: Response) => {
    try {
        const products:product= req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty product list" });
        }

        const remainingProducts: { id: number; no: number }[] = [];

        for (const product of products) {
            const { id, no } = product;

            // Fetch current stock
            const [rows]: any = await connection.execute("SELECT stock,price FROM products WHERE id = ?", [id]);
            if (rows.length === 0) {
                remainingProducts.push(product); // Product not found
                continue;
            }

            let currentStock = rows[0].stock;
            let price = rows[0].price;
            let newStock = currentStock - no;

            // If stock would go negative, add to remaining list
            if (newStock < 0) {
                remainingProducts.push(product);
                continue;
            }

            // Update stock
            await connection.execute("UPDATE products SET stock = ? WHERE id = ?", [newStock, id]);
             // Insert into sales table (recording the sale)
             await connection.execute(
                "INSERT INTO sales (product_id, quantity, total_price, sale_date) VALUES (?, ?, ?, NOW())",
                [id, no, price * no] // Total price = price * quantity
            );
            
        }
        const productList = await connection.execute("SELECT * FROM products");


        res.status(200).json({ 
            message: "Stock updated successfully", 
            stoke: productList
        });
    } catch (err) {
        console.error("❌ Remove Stock Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
});




 const startExpress=()=>{
    server.listen(8080,()=>{
        console.log("Express is available");
    })
}
export default startExpress;
