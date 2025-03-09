import React  from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../compnents/header';

const Home:React.FC= ()=> {
  const navigate = useNavigate();

  return (
    <> <Header/>
    <div className="flex flex-col items-center justify-center h-screen bg-blue-500 text-white">
     
      <h1 className="text-3xl font-bold mb-6">Select Your Role</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-200"
          onClick={() => navigate('/admin')}
        >
          Admin
        </button>
        <button 
          className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-200"
          onClick={() => navigate('/sales')}
        >
          Cashier
        </button>
        <button 
          className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-200"
          onClick={() => navigate('/Supplier')}
        >
          Manager
        </button>
        <button 
          className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-200"
          onClick={() => navigate('/stock')}
        >
          Supplier
        </button>
      </div>
    </div></>
  );
};

export default Home;
