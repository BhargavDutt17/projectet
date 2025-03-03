import React from 'react'
import { Menu, Transition } from "@headlessui/react";
import { Link,useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { GiDoubleRingedOrb } from "react-icons/gi";

export const AdminPrivateNavbar = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    // //remove the user from storage
    // localStorage.removeItem("userInfo");
    // // Optionally, redirect to login page or perform other actions
    navigate("/login"); // Change this to "/" if you want to go to the homepage

  };

  return (
    <nav className="bg-white dark:bg-gray-950 shadow sticky top-0 z-50">
    <div className="mx-auto max-w-16xl  px-4 sm:px-6 lg:px-8"> {/* max-w-7xl removed */}
      <div className="flex h-16 justify-between items-center">
        <div className="flex items-center ">
          {/* Logo */}
          {/* <GrGoogleWallet className="h-8 w-auto text-violet-500" /> */}
          
                      <GiDoubleRingedOrb className="h-8 w-auto text-violet-500" />
          <Link
            to="/"
            className="ml-4 text-lg font-bold text-violet-500"
          >
            MyExpenses
          </Link>
        </div>
        <div className="hidden md:flex md:space-x-8 justify-center -ml-10">
          <Link
            to="/admin"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-950 dark:text-violet-500 
            hover:border-violet-400 hover:text-violet-800"
          >
            Admin1
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-950 dark:text-violet-500 
            hover:border-violet-400 hover:text-violet-800"
          >
            Admin2
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-950 dark:text-violet-500 
            hover:border-violet-400 hover:text-violet-800"
          >
            Admin3
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-950 dark:text-violet-500 
            hover:border-violet-400 hover:text-violet-800"
          >
            Admin4
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-950 dark:text-violet-500 
            hover:border-violet-400 hover:text-violet-800"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex items-center">
          <button
            onClick={logoutHandler}
            type="button"
            className="relative m-2 inline-flex items-center gap-x-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 
            hover:to-purple-900 text-violet-300 px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-indigo-600"
          >
            <IoLogOutOutline className="h-5 w-5" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
  )
}
