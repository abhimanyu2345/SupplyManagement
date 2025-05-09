import { useState, useEffect } from "react";
import Header from "../compnents/header";
import { backend_Url } from "../constants";
import axios from "axios";

interface User {
  id: number;
  username: string;
  role: "admin" | "cashier" | "manager" | "supplier";
  created_at: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("cashier");

  // Dummy Users
  useEffect(() => {
   
   const fetchUser=async()=>{
    try{
      const response= await axios.get(`${backend_Url}/fetch_users`,{withCredentials:true});
      console.log("users fetched successfully",response.data);
      setUsers(response.data);
    }

   
   catch(error) {
     console.error(error);
  }
   
   
   
}
 fetchUser();
   
  }, []);

  // Handle User Creation
  const handleCreateUser = async() => {
    if (!username || !password) {
      alert("Username and Password are required.");

      return;
    }

   try{
    const response = await axios.post(`${backend_Url}/add_user`,{username,password,role},{withCredentials:true});
    setUsers(response.data);
   
   }
   catch(error) {
    confirm(error);
   }


    alert("User created successfully!");
  };
  const handleDeleteUser =async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try{
        
        const response = await axios.delete(`${backend_Url}/remove_user/${id}`,{withCredentials:true});
    setUsers(response.data);


      }
      catch(error){
        console.error(error);
      }

      setUsers(users.filter(user => user.id !== id));
      
    }
  };

  return (
    <><Header/>
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-4xl mx-auto p-6 bg-[#1E1E1E] shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">Admin Panel - Manage Users</h2>

        {/* User Creation Form */}
        <div className="mb-6 p-4 bg-[#232323] rounded-lg">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Create New User</h3>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#2E2E2E] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#2E2E2E] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as User["role"])}
            className="w-full bg-[#2E2E2E] text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
          >
            <option value="admin">Admin</option>
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
        
          </select>
          <button
            onClick={handleCreateUser}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Create User
          </button>
        </div>

        {/* User List */}
        <h3 className="text-2xl font-semibold text-blue-400 mb-4">Users List</h3>
        <table className="w-full border border-gray-700">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 border border-gray-700">Username</th>
              <th className="p-3 border border-gray-700">Role</th>
              <th className="p-3 border border-gray-700">Created At</th>
              <th className="p-3 border border-gray-700">Edit</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center bg-[#232323] hover:bg-[#2E2E2E] transition">
                <td className="p-3 border border-gray-700">{user.username}</td>
                <td className="p-3 border border-gray-700">{user.role}</td>
               
                <td className="p-3 border border-gray-700">{user.created_at}</td>
                <td className="p-3 border border-gray-700"><button onClick={()=>{handleDeleteUser(user.id)}} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"> remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div></>
  );
};

export default AdminPage;
