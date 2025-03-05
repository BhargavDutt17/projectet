// // import './App.css'
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import { BrowserRouter, Route, Routes ,useLocation } from 'react-router-dom'
// import { Login } from './components/Users/Login'
// import { Register } from './components/Users/Register'
// import { TransactionForm } from './components/Transactions/TransactionForm'
// import { HomePage } from './components/Home/HomePage'
// import {PublicNavbar} from './components/Navbar/PublicNavbar'
// import {PrivateNavbar} from './components/Navbar/PrivateNavbar'
// import { AddCategory } from './components/Category/AddCategory'
// import { Dashboard } from './components/Users/Dashboard'




// function App() {
 
//   return (
//    <BrowserRouter>
//      {/* <PublicNavbar path={['/', '/login', '/register']} /> */}
//      <NavbarHandler />
//     <Routes>
//       <Route path='/' element={<HomePage/>}></Route>
//       <Route path='/login' element={<Login/>}></Route>
//       <Route path='/register' element={<Register/>}></Route>
//       <Route path='/addtransaction' element={<TransactionForm/>}></Route>
//       <Route path='/addcategory' element={<AddCategory/>}></Route>
//       <Route path="/dashboard" element={<Dashboard/>}></Route>
      
     
//     </Routes>
//     </BrowserRouter>
//   )
// }
// const NavbarHandler = () => {
//   const location = useLocation();

//   // Define public paths
//   const publicPaths = ['/', '/login', '/register'];

//   // Check if the current path is a public path
//   const isPublicPath = publicPaths.includes(location.pathname);

//   return (
//     <>
//       {isPublicPath ? <PublicNavbar /> : <PrivateNavbar />}
//     </>
//   );
// };
  
    
// export default App


import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
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


//Set backend API base URL globally
axios.defaults.baseURL = "http://127.0.0.1:8000";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  const loginUser = async (data) => {
    try {
      const response = await axios.post("/users/login/", data, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("Response Data:", response.data); // Debugging

      if (response.data.user) {
        const userRole = response.data.user.role ? response.data.user.role.name : "user"; // Default to 'user'
        
        localStorage.setItem("role", userRole);
        setRole(userRole);
        window.location.href = "/dashboard";
      } else {
        alert("Login failed. Invalid response from server.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Error logging in. Please check your credentials.");
    }
  };
  
  const registerUser = async (data) => {
    console.log("Registering user:", data); //Debugging
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/users/", data, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("Registration response:", response.data); //Debugging
  
      if (response.data.message) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Error registering. Please check console for details.");
    }
  };
  
  

  return (
    <BrowserRouter>
      <NavbarHandler role={role} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login loginUser={loginUser} />} />
        <Route path="/register" element={<Register registerUser={registerUser} />} />
        <Route path="/addtransaction" element={<TransactionForm />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard/>} requiredRole="admin" />} />
      </Routes>
    </BrowserRouter>
  );
}

//Dynamically selects navbar
const NavbarHandler = ({ role }) => {
  const location = useLocation();
  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.includes(location.pathname);
  return <>{isPublicPath || !role ? <PublicNavbar /> : role === "admin" ? <AdminPrivateNavbar/> : <PrivateNavbar />}</>;
};

// Protect admin routes
const ProtectedRoute = ({ element, requiredRole }) => {
  const role = localStorage.getItem("role");
  return !role || (requiredRole && role !== requiredRole) ? <Navigate to="/login" /> : element;
};

export default App;