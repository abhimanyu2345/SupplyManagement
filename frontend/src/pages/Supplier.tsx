import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import Header from "../compnents/header";
import { backend_Url } from "../constants";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  // Fetch Suppliers from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backend_Url}/fetch_suppliers`);
        console.log("Fetched Suppliers:", response.data);
        setSuppliers(response.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchData();
  }, []);

  // Handle Form Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add New Supplier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backend_Url}/add_supplier`, formData);
      setSuppliers([...suppliers, response.data.supplier]); // Update state with new supplier
      setFormData({ name: "", contact: "", email: "", address: "" });
    } catch (err) {
      console.error("Error adding supplier:", err);
    }
  };

  // Remove Supplier
  const handleRemoveSupplier = async (id: number) => {
    try {
      await axios.delete(`${backend_Url}/remove_supplier/${id}`);
      setSuppliers(suppliers.filter((supplier) => supplier.id !== id)); // Update state
    } catch (err) {
      console.error("Error removing supplier:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#121212] text-white p-6">
        <div className="max-w-5xl mx-auto p-6 bg-[#1E1E1E] shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-blue-400">Suppliers Management</h2>

          {/* Supplier Entry Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#232323] p-4 rounded-lg shadow-lg">
            <input
              type="text"
              name="name"
              placeholder="Supplier Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 col-span-2"
              required
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg col-span-2 transition-all">
              Add Supplier
            </button>
          </form>

          {/* Suppliers Table */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-gray-700 text-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 border border-gray-700">ID</th>
                  <th className="p-3 border border-gray-700">Name</th>
                  <th className="p-3 border border-gray-700">Contact</th>
                  <th className="p-3 border border-gray-700">Email</th>
                  <th className="p-3 border border-gray-700">Address</th>
                  <th className="p-3 border border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="bg-[#232323] hover:bg-[#2E2E2E] transition">
                    <td className="p-3 border border-gray-700 text-center">{supplier.id}</td>
                    <td className="p-3 border border-gray-700 text-center">{supplier.name}</td>
                    <td className="p-3 border border-gray-700 text-center">{supplier.contact}</td>
                    <td className="p-3 border border-gray-700 text-center">{supplier.email}</td>
                    <td className="p-3 border border-gray-700 text-center">{supplier.address}</td>
                    <td className="p-3 border border-gray-700 text-center">
                      <button
                        onClick={() => handleRemoveSupplier(supplier.id)}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-lg transition-all"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuppliersPage;
