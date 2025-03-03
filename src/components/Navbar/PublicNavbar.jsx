import React from 'react'
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { GrGoogleWallet } from "react-icons/gr";
import { RiLoginCircleLine } from "react-icons/ri";
import { GiDoubleRingedOrb } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { FaBlog } from "react-icons/fa";
import { useLocation } from 'react-router-dom'

export const PublicNavbar = ({ path }) => {
  const location = useLocation()

  // if (!path.includes(location.pathname)) {
  //   return null
  // }
  // if (!Array.isArray(path) || !path.includes(location.pathname)) {
  //   return null;
  // }

  return (
    <nav className="bg-white dark:bg-gray-950 shadow sticky top-0 z-50"> {/*bg-white shadow*/}
      <div className="mx-auto max-w-16xl  px-4 sm:px-6 lg:px-8"> {/*max-w-7xl put it if needed */}
        <div className="flex h-16 justify-between items-center"> {/*items-center  addded*/}
          <div className="flex items-center"> 
          

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
          <div className="flex items-center">
            <Link
              to="/register"
              className="relative inline-flex items-center gap-x-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 
              hover:to-purple-900 text-violet-300 px-3 py-2 text-sm font-semibold shadow-sm 
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <FaRegUser className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Register
            </Link>
            <Link
              to="/login"
              className="relative ml-4 inline-flex items-center gap-x-1.5 rounded-md  bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 
              hover:to-purple-900 text-violet-300 px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline 
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 animate-bounce"
            >
              <RiLoginCircleLine className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Login
            </Link>
          </div>
        </div>
      </div>
       </nav>
  );
}
