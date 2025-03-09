import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
//import Admin from './pages/Admin';
//import Navbar from './components/Navbar';
//import Footer from './components/Footer';
import SuppliersPage from './pages/Supplier';
import SalesPage from './pages/Sales';
import StockManagementPage from './pages/StockMangent';
import AdminPage from './pages/Admin';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Stock" element={<StockManagementPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/supplier" element={<SuppliersPage />} />
            <Route path="/Admin" element={<AdminPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/login" element={<LoginPage/>} />
            
            
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;
