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
import { CategoriesList } from "./components/Category/CategoriesList";
import { UserProfile } from "./components/Users/UserProfile"
import { TransactionReport } from "./components/Transactions/TransactionReport";
import { TransactionList } from "./components/Transactions/TransactionList";
import Activate  from "./components/Users/Activate";
import { UserList } from "./components/Admin/UserList";
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
    window.addEventListener("customLogout", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("customLogout", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <NavbarHandler role={role} setRole={setRole} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<Activate />} />

        {/* User Routes */}
        <Route element={<PrivateRoutes requiredRole="user" />}>
          <Route path="/user">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="addtransaction" element={<TransactionForm />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="categorieslist" element={<CategoriesList />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="transactionreports" element={<TransactionReport />} />
            <Route path="trasactionlists" element={<TransactionList />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoutes requiredRole="admin" />}>
          <Route path="/admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="admintransactions" element={<AdminTransactionList />} />
            <Route path="adminaddcategory" element={<AdminAddCategory />} />
            <Route path="userlist" element={<UserList/>}/>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// NavbarHandler component to manage navbar rendering
function NavbarHandler({ role, setRole }) {
  if (role === "admin") return <PrivateNavbar setRole={setRole} />;
  if (role === "user") return <PrivateNavbar setRole={setRole} />;
  return <PublicNavbar />;
}


export default App;
