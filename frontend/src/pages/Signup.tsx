import { useState } from "react";
import Header from "../compnents/header";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");

  const handleSignup = () => {
    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    alert(`User ${username} registered as ${role}`);
    setUsername("");
    setPassword("");
    setRole("cashier");
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="w-full max-w-md p-8 bg-[#1E1E1E] rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Signup</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-[#232323] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#232323] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-[#232323] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
        >
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
          <option value="manager">Manager</option>
          <option value="supplier">Supplier</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-400">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
