import { useState, useEffect } from "react";
import Header from "../compnents/header";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  expiry_date?: string;
  barcode?: string;
}

interface Sale {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  total_price: number;
  cashier: string;
}

const SalesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Sale[]>([]);
  const [cashier, setCashier] = useState("");

  // Dummy Product List
  useEffect(() => {
    setProducts([
      { id: 1, name: "Apple", category: "Fruits", price: 3.00, stock: 50, expiry_date: "2025-12-31", barcode: "1234567890" },
      { id: 2, name: "Milk", category: "Dairy", price: 2.80, stock: 30, expiry_date: "2024-09-15", barcode: "0987654321" },
      { id: 3, name: "Chicken", category: "Meat", price: 7.99, stock: 25, expiry_date: "2024-08-20", barcode: "5432109876" },
      { id: 4, name: "Rice", category: "Grains", price: 6.50, stock: 80, expiry_date: "2026-06-30", barcode: "6789012345" }
    ]);
  }, []);

  // Add Product to Cart
  const addToCart = (product: Product) => {
    if (product.stock === 0) return; // Prevent adding if out of stock

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) return prevCart;
        return prevCart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * product.price }
            : item
        );
      } else {
        return [...prevCart, { id: cart.length + 1, product_id: product.id, name: product.name, quantity: 1, total_price: product.price, cashier }];
      }
    });

    // Reduce stock in product list
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
    );
  };

  // Remove Product from Cart
  const removeFromCart = (product: Sale) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity - 1, total_price: (item.quantity - 1) * product.total_price / item.quantity }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    // Increase stock in product list
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.product_id ? { ...p, stock: p.stock + 1 } : p))
    );
  };

  // Handle Checkout
  const handleCheckout = () => {
    if (!cashier) {
      alert("Please enter cashier name.");
      return;
    }

    /* fetch("http://localhost:5000/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cart),
    })
      .then((res) => res.json())
      .then(() => { */
        alert("Sales recorded successfully!");
        setCart([]);
      /* })
      .catch((err) => console.error("Error processing sale:", err)); */
  };

  return (
    <><Header/>
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-6xl mx-auto p-6 bg-[#1E1E1E] shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">Sales Transactions</h2>

        {/* Cashier Input */}
        <input
          type="text"
          placeholder="Enter Cashier Name"
          value={cashier}
          onChange={(e) => setCashier(e.target.value)}
          className="w-full bg-[#232323] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mb-6"
          required
        />

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`bg-[#232323] hover:bg-blue-600 transition text-white p-4 rounded-lg shadow-md text-center 
              ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <p className="text-lg font-semibold">{product.name}</p>
              <p className="text-gray-400">{product.category}</p>
              <p className="text-gray-400">${product.price.toFixed(2)}</p>
              <p className="text-gray-400">Stock: {product.stock}</p>
            </button>
          ))}
        </div>

        {/* Cart Table */}
        {cart.length > 0 && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">Cart</h3>
            <table className="w-full border border-gray-700">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 border border-gray-700">Product</th>
                  <th className="p-3 border border-gray-700">Quantity</th>
                  <th className="p-3 border border-gray-700">Total Price</th>
                  <th className="p-3 border border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="text-center bg-[#232323] hover:bg-[#2E2E2E] transition">
                    <td className="p-3 border border-gray-700">{item.name}</td>
                    <td className="p-3 border border-gray-700">{item.quantity}</td>
                    <td className="p-3 border border-gray-700">${item.total_price.toFixed(2)}</td>
                    <td className="p-3 border border-gray-700">
                      <button onClick={() => removeFromCart(item)} className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">-</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Checkout Button */}
            <button onClick={handleCheckout} className="mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-all w-full">
              Complete Sale
            </button>
          </div>
        )}
      </div>
    </div></>
  );
};

export default SalesPage;
