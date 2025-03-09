import { useState } from "react";
import React from "react";
import Header from "../compnents/header";
const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "FreshFarm Ltd", contact: "123-456-7890", email: "freshfarm@example.com", address: "123 Green St." },
    { id: 2, name: "DairyBest", contact: "987-654-3210", email: "dairybest@example.com", address: "45 Milk Ave." },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier = { id: suppliers.length + 1, ...formData };
    setSuppliers([...suppliers, newSupplier]);
    setFormData({ name: "", contact: "", email: "", address: "" });
  };

  return (
    <><Header/>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div></>
  );
};

export default SuppliersPage;
