import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline, IoPersonCircleOutline, IoCloseCircle } from "react-icons/io5";
import { GiDoubleRingedOrb } from "react-icons/gi";
import { HiMenu } from "react-icons/hi";
import axios from "axios";

export const PrivateNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();

  const fetchUserData = () => {
    const userId = localStorage.getItem("id");
    const userRole = localStorage.getItem("role");

    if (userId && userRole) {
      setRole(userRole);
      axios.get(`/user/profile/${userId}`)
        .then(response => {
          if (response.data) {
            setProfileImage(response.data.profile_image || null);
            setUsername(response.data.username || "Admin");
          }
        })
        .catch(error => console.error("Error fetching profile data:", error));
    } else {
      setRole(""); // User is logged out
      setProfileImage(null);
      setUsername("");
    }
  };

  useEffect(() => {
    fetchUserData();

    const handleLogout = () => {
      fetchUserData();
    };

    window.addEventListener("customLogout", handleLogout);
    return () => window.removeEventListener("customLogout", handleLogout);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("role_id");

    // Dispatch custom event so both App.jsx and this component sync
    window.dispatchEvent(new Event("customLogout"));

    navigate("/login");
  };

  // // This is for testing
  // console.log("Current role in PrivateNavbar:", role);

  const userMenuItems = [
    { path: "/user/dashboard", label: "Dashboard" },
    { path: "/user/addtransaction", label: "Add Transaction" },
    { path: "/user/addcategory", label: "Add Category" },
    { path: "/user/categorieslist", label: "Categories" },
    { path: "/user/profile", label: "Profile" },
    { path: "/user/transactionreports", label: "Transaction Report" },
    { path: "/user/trasactionlists", label: "Trasaction List" }
  ];

  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/userlist", label: "UserList" },
    { path: "/admin/admintransactionlists", label: "User Transaction" },
    { path: "/admin/addtransactiontype", label: "Add Transaction Type" },
    { path: "/admin/addcategory", label: "Add Category" },
    { path: "/admin/transactiontypelist", label: "Transaction Types" },
  ];


  return (
    <nav className="bg-white dark:bg-gray-950 shadow sticky top-0 z-50">
      <div className="mx-auto max-w-16xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">

          {/* Left: Hamburger Icon */}
          <button className="text-violet-500 text-4xl" onClick={() => setIsDrawerOpen(true)}>
            <HiMenu />
          </button>

          <div className="flex items-center">
            {/* Logo */}
            <GiDoubleRingedOrb className="h-8 w-auto text-violet-500" />
            <Link to="/" className="ml-4 text-lg font-bold text-violet-500">
              MyExpenses
            </Link>
          </div>

          <div className="flex items-center">
            {/* Clickable Profile Picture */}
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer border-2 border-violet-500 hover:scale-105 transition"
                onClick={() => setIsModalOpen(true)}
              />
            ) : (
              <IoPersonCircleOutline
                className="h-10 w-10 text-violet-500 cursor-pointer hover:text-violet-700 transition"
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Profile Picture */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // Closes modal on backdrop click
        >
          <div className="absolute top-16 right-5 bg-white w-72 p-11 bg-white dark:bg-gray-950 rounded-lg shadow-lg flex flex-col 
  items-center z-50 border border-violet-500"  onClick={(e) => e.stopPropagation()}>

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 flex items-center gap-2 text-violet-500 hover:text-white text-lg font-semibold 
                transition-transform transform hover:scale-75 hover:bg-violet-600 px-3 py-2 rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              <IoCloseCircle className="h-6 w-6" />
              <span className=''>Close</span>
            </button>

            {/* Large Profile Image */}
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-40 h-40 rounded-full border-4 border-violet-500 mt-8" />
            ) : (
              <IoPersonCircleOutline className="w-40 h-40 text-violet-500" />
            )}

            {/* Username */}
            <h2 className="mt-3 text-lg font-semibold text-violet-500">{username}</h2>

            {/* Buttons */}
            <div className="mt-8 space-y-2 w-full">
              <button
                className="w-full mb-4 inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 
              hover:to-purple-900 text-violet-300 px-14 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-indigo-600"
                onClick={() => {
                  setIsModalOpen(false);
                  navigate("/user/profile");
                }}
              >
                Go to Profile
              </button>
              <button
                className="w-full inline-flex items-center gap-x-1.5 rounded-md bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 
              hover:to-rose-900 text-red-200 px-14 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-red-600 text-center"
                onClick={logoutHandler}
              >
                <IoLogOutOutline className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer (Sidebar) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsDrawerOpen(false)}>
          <div className="w-64 bg-white dark:bg-gray-950 h-full shadow-lg p-5 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <button
                className="flex items-center gap-2 text-violet-500 hover:text-white text-lg font-semibold mb-5 
                transition-transform transform hover:scale-110 hover:bg-violet-600 px-3 py-2 rounded-lg"
                onClick={() => setIsDrawerOpen(false)}
              >
                <IoCloseCircle className="h-6 w-6" />
                <span>Close</span>
              </button>

              {/* Drawer Links */}
              <nav className="flex flex-col space-y-4">
                {(role === "admin" ? adminMenuItems : userMenuItems).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-4 py-3 rounded-lg text-violet-500 hover:bg-violet-600 hover:text-white transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutHandler}
              className="relative m-2 inline-flex items-center gap-x-1.5 rounded-md bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 
              hover:to-rose-900 text-red-200 px-14 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-red-600"
            >
              <IoLogOutOutline className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
