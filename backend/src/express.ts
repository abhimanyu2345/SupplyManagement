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
        const  { name, quantity } = req.body; // Expecting an array of products

        

        

            // Fetch product ID
            const [rows]: any = await connection.execute("SELECT id FROM products WHERE name = ?", [name]);

            if (rows.length === 0) {
                console.warn(`⚠️ Product not found: ${name}`);
                res.status(500).json({ error:`⚠️ Product not found: ${name}`  });

                return // Skip if product doesn't exist
            }

            const productId = rows[0].id;

            // Update stock
            await connection.execute("UPDATE products SET stock = stock + ? WHERE id = ?", [quantity,productId]);
            const [updatedProducts]: any = await connection.execute("SELECT * FROM products");

            res.status(200).json({ message: "Stock added successfully", stock: updatedProducts });
        }

        // Fetch updated products
     
    catch (err) {
        console.error("❌ Add Stock Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    
}});




server.post("/remove_stock", async (req: Request, res: Response) => {
    try {
        const products: {
            id: number;
            product_id: number;
            name: string;
            quantity: number;
            total_price: number;
            cashier: string;
          }[]= req.body.cart;
        console.log(products)
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty product list" });
        }

        const remainingProducts: {
            id: number;
            product_id: number;
            name: string;
            quantity: number;
            total_price: number;
            cashier: string;
          }[] =[];

        for (const product of products) {
            const {  product_id, quantity } = product;
            console.log(`${product_id} +${quantity}`);

            // Fetch current stock
            const [rows]: any = await connection.execute("SELECT stock,price FROM products WHERE id = ?", [product_id]);
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
            await connection.execute("UPDATE products SET stock = ? WHERE id = ?", [newStock, product_id]);
             // Insert into sales table (recording the sale)
             await connection.execute(
                "INSERT INTO sales (product_id, quantity, total_price, sale_date) VALUES (?, ?, ?, NOW())",
                [product_id, quantity, price * quantity] // Total price = price * quantity
            );
            
        }
        const [productList] = await connection.execute("SELECT * FROM products");


        res.status(200).json({ 
            message: "Stock updated successfully", 
            stoke: productList
        });
    } catch (err) {
        console.error("❌ Remove Stock Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
});



//logic for admin
server.get("/fetch_users", async (req: Request, res: Response) => {
    try {
        const [users] = await connection.execute("SELECT * FROM users");
        console.log("📦 users:", users);
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Error:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
});

server.post("/add_user", async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Insert new user (hash password before storing)
        await connection.execute(
            "INSERT INTO users (username, password, role) VALUES (?, SHA2(?, 256), ?)",
            [username, password, role]
        );

        // Fetch updated users list
        const [users] = await connection.execute("SELECT * FROM users");
        console.log("✅ User added:", username);
        res.status(201).json(users);
    } catch (err) {
        console.error("❌ Error adding user:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
});


server.delete("/remove_user/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Delete user by ID
        const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [id]);

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch updated users list
        const [users] = await connection.execute("SELECT * FROM users");
        console.log("🗑️ User removed:", id);
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Error removing user:", err.toString());
        res.status(500).json({ error: err.toString() });
    }
});

server.get("/fetch_suppliers", async (req, res) => {
    try {
      const [result] = await connection.query("SELECT * FROM suppliers");
      res.json(result);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // ✅ Remove a supplier by ID
// Remove a supplier by ID
server.delete("/remove_supplier/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await connection.query("DELETE FROM suppliers WHERE id = ?", [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Supplier not found" });
      }
  
      res.json({ message: "Supplier removed successfully", id });
    } catch (err) {
      console.error("Error removing supplier:", err);
      res.status(500).json({ error: "Database error" });
    }
  });
  
  server.post("/add_supplier", async (req, res) => {
    const { name, contact, email, address } = req.body;
  
    if (!name || !contact || !email || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const [result] = await connection.query(
        "INSERT INTO suppliers (name, contact, email, address) VALUES (?, ?, ?, ?)",
        [name, contact, email, address]
      );
  
      const newSupplier = {
        id: result.insertId, // MySQL returns the last inserted ID
        name,
        contact,
        email,
        address,
      };
  
      res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
    } catch (err) {
      console.error("Error adding supplier:", err);
      res.status(500).json({ error: "Database error" });
    }
  });
  


 const startExpress=()=>{
    server.listen(8080,()=>{
        console.log("Express is available");
    })
}
export default startExpress;
