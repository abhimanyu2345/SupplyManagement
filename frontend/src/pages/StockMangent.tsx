import React, { useEffect, useState } from "react";
import Header from "../compnents/header";
import { backend_Url} from "../constants";
import axios from "axios";

const StockManagementPage = () => {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`${backend_Url}/fetch_products`, {
          withCredentials: true,
        });
        console.log("Fetched stock:", response.data);
        setStock(response.data.map((p: any) => ({
          ...p,
          price: Number(p.price), status:(p.stock<10)?"Low Stock":"Available" // Convert to number
        })));
      } catch (error) {
        console.error("Error fetching stock:", error);
      }
    };

    fetchStock();
    

  }, []);


  const [formData, setFormData] = useState({
    name: "",
    category: "",
  stock: "",
    expiry_date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
  
  
    try {
      const response = await axios.post(
        `${backend_Url}/add_stock`,
        { name: formData.name, quantity: parseInt(formData.stock, 10) },
        { withCredentials: true }
      );
  
      setStock(response.data.stock.map((p: any) => ({
        ...p,
        price: Number(p.price),
        status: p.stock < 10 ? "Low Stock" : "Available"
      })));
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Failed to add stock!");
    }
  
    setFormData({ name: "", category: "", stock: "", expiry_date: "" });
  };
  

  return (
    <><Header/>
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-5xl mx-auto p-6 bg-[#1E1E1E] shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">Stock Management</h2>

        {/* Stock Entry Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#232323] p-4 rounded-lg shadow-lg">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-[#1A1A1A] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="bg-[#1A1A1A] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Quantity"
            value={formData.stoke}
            onChange={handleChange}
            className="bg-[#1A1A1A] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="bg-[#1A1A1A] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg col-span-2 transition-all">
            Add to Stock
          </button>
        </form>

        {/* Stock Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full border border-gray-700 text-white">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 border border-gray-700">ID</th>
                <th className="p-3 border border-gray-700">Name</th>
                <th className="p-3 border border-gray-700">Category</th>
                <th className="p-3 border border-gray-700">Quantity</th>
                <th className="p-3 border border-gray-700">Expiry Date</th>
                <th className="p-3 border border-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id} className="bg-[#232323] hover:bg-[#2E2E2E] transition">
                  <td className="p-3 border border-gray-700 text-center">{item.id}</td>
                  <td className="p-3 border border-gray-700 text-center">{item.name}</td>
                  <td className="p-3 border border-gray-700 text-center">{item.category}</td>
                  <td className="p-3 border border-gray-700 text-center">{item.stock}</td>
                  <td className="p-3 border border-gray-700 text-center">{Date(item.expiry_date).toString()}</td>
                  <td className={`p-3 border border-gray-700 text-center ${item.status === "Low Stock" ? "text-red-500" : "text-green-400"}`}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div></>
  );
};

export default StockManagementPage;
