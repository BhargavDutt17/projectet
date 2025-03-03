import React from 'react'
import {
    FaMoneyBillWave,
    FaRegCalendarAlt,
    FaSignInAlt,
    FaList,
    FaChartPie,
    FaQuoteLeft,
  } from "react-icons/fa";
  import { GrMoney } from "react-icons/gr";
  import { PiMoneyWavyFill } from "react-icons/pi";
  import { IoIosStats } from "react-icons/io";
  import { FaFilter } from "react-icons/fa6";
  import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Heading */}
          <h1 className="text-5xl font-bold text-center text-gray-50 dark:text-gray-950">
            Track Your Expenses Effortlessly
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-xl text-center text-gray-50 dark:text-gray-950">
            Manage your finances with a modern solution designed for you.
          </p>

          {/* Feature Icons */}
          <div className="flex space-x-8 mt-10">
            <div className="flex flex-col items-center">
              <PiMoneyWavyFill className="text-3xl text-gray-50 dark:text-gray-950" />
              <p className="mt-2 text-gray-50 dark:text-gray-950 font-medium">Efficient Tracking</p>
            </div>
            <div className="flex flex-col items-center">
              <FaFilter className="text-3xl text-gray-50 dark:text-gray-950" />
              <p className="mt-2 text-gray-50 dark:text-gray-950 font-medium">Transactions Filtering</p>
            </div>
            <div className="flex flex-col items-center">
              <IoIosStats className="text-3xl text-gray-50 dark:text-gray-950" />
              <p className="mt-2 text-gray-50 dark:text-gray-950 font-medium">Insightful Reports</p>
            </div>
          </div>

          {/* Call to Action Button */}
          <Link to="/register">
            <button className="mt-8 px-6 py-3 bg-gray-50 dark:bg-gray-950 hover:bg-violet-300
             border border-violet-950 text-violet-800 dark:text-violet-600 font-semibold rounded-lg shadow-md transition duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>
      {/* How it works */}
     
      <div className="py-20 px-4 bg-white dark:bg-gray-950">
        <h2 className="text-3xl font-bold text-center text-gray-950 dark:text-violet-500">
          How It Works
        </h2>
        <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 text-gray-50 dark:text-gray-950 mb-4">
              <FaSignInAlt className="text-xl " />
            </div>
            <h3 className="mb-2 font-semibold text-gray-950 dark:text-violet-500">Sign Up</h3>
            <p className="text-gray-950 dark:text-gray-50">Register and start managing your expenses in a minute.</p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 text-gray-50 dark:text-gray-950 mb-4">
              <FaList className="text-xl" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-950 dark:text-violet-500">Add Transactions</h3>
            <p className="text-gray-950 dark:text-gray-50">Quickly add income and expenses to your account.</p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 text-gray-50 dark:text-gray-950 mb-4">
              <FaChartPie className="text-xl" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-950 dark:text-violet-500">View Reports</h3>
            <p className="text-gray-950 dark:text-gray-50">See insightful reports & graphs of your finances.</p>
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="bg-white dark:bg-gray-950 py-20 px-4 ">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-violet-500">
          What Our Users Say
        </h2>
        <div className="mt-10 max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-lg shadow-lg">
            <FaQuoteLeft className="text-xl text-gray-50 dark:text-gray-950" />
            <p className="mt-4 text-gray-50 dark:text-gray-950">
              "This app has revolutionized the way I track my expenses. Highly
              intuitive and user-friendly."
            </p>
            <p className="mt-4 font-bold text-gray-50 dark:text-gray-950">- Nishit Patel</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-lg shadow-lg">
            <FaQuoteLeft className="text-xl text-gray-50 dark:text-gray-950" />
            <p className="mt-4 text-gray-50 dark:text-gray-950">
              "Finally, a hassle-free way to manage my finances. The insights
              feature is a game changer!"
            </p>
            <p className="mt-4 font-bold text-gray-50 dark:text-gray-950">- Safvan Malek</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-lg shadow-lg">
            <FaQuoteLeft className="text-xl text-gray-50 dark:text-gray-950" />
            <p className="mt-4 text-gray-50 dark:text-gray-950">
              "Finally, a hassle-free way to manage my finances. The insights
              feature is a game changer!"
            </p>
            <p className="mt-4 font-bold text-gray-50 dark:text-gray-950">- Bhargav Dutt</p>
          </div>
        </div>
      </div>
      
      
      {/* CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-50 dark:text-gray-950">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mt-4 text-gray-50 dark:text-gray-950">
            Join us now and start managing your expenses like a pro!
          </p>
          <Link to="/register">
            <button className="mt-8 px-6 py-3 bg-gray-50 dark:bg-gray-950 hover:bg-violet-300
             border border-violet-950 text-violet-800 dark:text-violet-600 font-semibold rounded-lg shadow-md transition duration-300">
              Sign Up For Free
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
