import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline, IoPersonCircleOutline, IoCloseCircle } from "react-icons/io5";
import { GiDoubleRingedOrb } from "react-icons/gi";
import { HiMenu } from "react-icons/hi";

export const AdminPrivateNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("id"); // Clear admin ID
    localStorage.removeItem("role"); // Clear admin role
    navigate("/login"); // Redirect to login page
  };

  const menuItems = [
    { path: "/admin/adminaddcategory", label: "Admin1" },
    { path: "/admin/admintransactions", label: "Admin2" },
    { path: "/admin/admin", label: "Admin3" },
    { path: "/admin/admin", label: "Admin4" },
    { path: "/admin/admin", label: "Dashboard" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-950 shadow sticky top-0 z-50">
      <div className="mx-auto max-w-16xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">

          {/* Left: Hamburger Icon (Visible only on large screens) */}
          <button
            className="text-violet-500 text-4xl hidden lg:block"
            onClick={() => setIsDrawerOpen(true)}
          >
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
            {/* Temporary Profile Picture Icon */}
            <IoPersonCircleOutline className="h-10 w-10 text-violet-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Drawer (Sidebar for Large Screens Only) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden lg:block"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-64 bg-gray-800 h-full shadow-lg p-5 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              {/* Close Button with Enhanced Hover Effect */}
              <button
                className="flex items-center gap-2 text-violet-500 hover:text-white text-lg font-semibold mb-5 
             transition-transform transform hover:scale-110 hover:bg-violet-600 px-3 py-2 rounded-lg"
                onClick={() => setIsDrawerOpen(false)}
              >
                <IoCloseCircle className="h-6 w-6" />
                <span>Close</span>
              </button>

              {/* Drawer Links with Hover Effect */}
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) => (
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

            {/* Logout Button at Bottom */}
            <button
              onClick={logoutHandler}
              className="relative m-2 inline-flex items-center gap-x-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 
            hover:to-purple-900 text-violet-300 px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-indigo-600"
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
