import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react"; 
import { Login } from "./components/Users/Login";
import { Register } from "./components/Users/Register";
import { TransactionForm } from "./components/Transactions/TransactionForm";
import { HomePage } from "./components/Home/HomePage";
import { PublicNavbar } from "./components/Navbar/PublicNavbar";
import { PrivateNavbar } from "./components/Navbar/PrivateNavbar";
import { AddCategory } from "./components/Category/AddCategory";
import { Dashboard } from "./components/Users/Dashboard";
import { AdminDashboard } from "./components/Users/AdminDashboard";
import { AdminPrivateNavbar } from "./components/Navbar/AdminPrivateNavbar";
import { AdminTransactionList } from "./components/Transactions/AdminTransactionList";
import PrivateRoutes from "./components/hooks/PrivateRoutes";
import { AdminAddCategory } from "./components/Category/AdminAddCategory";

// Set backend API base URL globally
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.post["Content-Type"] = "application/json";


function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <NavbarHandler role={role} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route element={<PrivateRoutes requiredRole="user" />}>
          <Route path="/user">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="addtransaction" element={<TransactionForm />} />
            <Route path="addcategory" element={<AddCategory />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoutes requiredRole="admin" />}>
          <Route path="/admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="admintransactions" element={<AdminTransactionList />} />
            <Route path="adminaddcategory" element={<AdminAddCategory/>}/>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// NavbarHandler component to manage navbar rendering
const NavbarHandler = ({ role }) => {
  const location = useLocation();
  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.includes(location.pathname);
  
  return (
    <>
      {isPublicPath || !role ? (<PublicNavbar /> ) : role === "admin" ? (<AdminPrivateNavbar />) : (<PrivateNavbar />)}
    </>
  );
};

export default App;

