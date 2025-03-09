import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  role: "admin" | "cashier" | "manager" | "supplier";
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from local storage or backend
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-[#1E1E1E] text-white flex justify-between items-center p-4 shadow-md">
       <h1 onClick={()=>{navigate('/')}} className="text-2xl font-bold text-blue-400 cursor-pointer"> My Store</h1>
      {user ? (
        <div className="flex items-center gap-4">
          <p className="text-gray-300">👤 {user.username} ({user.role})</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Login
        </button>
      )}
    </header>
  );
};

export default Header;
