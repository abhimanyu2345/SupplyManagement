import { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter your credentials.");
      return;
    }

    alert(`Logged in as ${username}`);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="w-full max-w-md p-8 bg-[#1E1E1E] rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Login</h2>

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

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-blue-400">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
