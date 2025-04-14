import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
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
import { AdminTransactionList } from "./components/Transactions/AdminTransactionList";
import PrivateRoutes from "./components/hooks/PrivateRoutes";
import { AdminAddCategory } from "./components/Category/AdminAddCategory";
import { CategoriesList } from "./components/Category/CategoriesList";
import { Profile} from "./components/Users/Profile"
import { TransactionReport } from "./components/Transactions/TransactionReport";
import { TransactionList } from "./components/Transactions/TransactionList";
import Activate  from "./components/Users/Activate";
import { UserList } from "./components/Admin/UserList";
import { AddTransactionType} from "./components/Transactions/AddTransactionType";
import { AdminTransactionTypeList } from "./components/Transactions/AdminTransactionTypeList";
import { AdminCategoriesList } from "./components/Category/AdminCategoriesList";
import { UserReport } from "./components/Admin/UserReport";
import ForgetPassword from "./components/Users/ForgetPassword";
import ResetPassword from "./components/Users/ResetPassword";
import ToastWrapper from "./components/Custom/ToastWrapper";

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

      
      {/* Global Toastify container */}

      <ToastWrapper/>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="/forgotpassword" element={<ForgetPassword/>}/>
        <Route path="/resetpassword/:token"  element={<ResetPassword/>}/>

        {/* User Routes */}
        <Route element={<PrivateRoutes requiredRole="user" />}>
          <Route path="/user">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="addtransaction" element={<TransactionForm />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="categorieslist" element={<CategoriesList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="transactionreports" element={<TransactionReport />} />
            <Route path="trasactionlists" element={<TransactionList />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoutes requiredRole="admin" />}>
          <Route path="/admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="admintransactionlists" element={<AdminTransactionList />} />
            <Route path="addcategory" element={<AdminAddCategory />} />
            <Route path="userlist" element={<UserList/>}/>
            <Route path="addtransactiontype" element={<AddTransactionType/>}/>
            <Route path="transactiontypelist" element={<AdminTransactionTypeList/>}/>
            <Route path="admincategorieslist" element={<AdminCategoriesList/>}/>
            <Route path="userreport" element={<UserReport/>}/>
            <Route path="profile" element={<Profile/>}/>
          </Route>
          {/* <Route path="/user/admintransactionlists/:user_id" element={<AdminTransactionList />} /> */}
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
