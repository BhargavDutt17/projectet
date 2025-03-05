import React from 'react'
import { useForm } from "react-hook-form";
import { FaUser , FaLock } from "react-icons/fa";
import { Link } from "react-router-dom"; // Make sure to import Link from react-router-dom


export const Login = ({ loginUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formattedData = {
      email: data.email.trim(), // Ensure correct format
    password: data.password,
    };
    loginUser(formattedData);
    
    // Here you can handle the form submission, e.g., call an API
  };

  // Validation rules
  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Invalid email format",
    },
  };

  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 5,
      message: "Password must be at least 5 characters long",
    },
  };
 
  
  return (
    // <div className="min-h-screen bg-white dark:bg-gray-950  flex items-center justify-center w-full transition-colors duration-300 "> 
    // {/* <div className="w-full max-w-md mx-auto my-10 bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg border border-violet-500 mb-20"> */}
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-1 transition-colors duration-300">
    <form
    onSubmit={handleSubmit(onSubmit)}
    className="max-w-md mx-auto bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg space-y-6 border border-violet-500"
  >
      <h2 className="text-3xl font-semibold text-center text-violet-500">Login</h2>
      <p className="text-sm text-center text-violet-500 font-medium">Login to your account</p>

      {/* Input Field - Email */}
      <div className="relative">
        <FaUser  className="absolute top-3 left-3 text-violet-500" />
        <input
          id="email"
          type="text"
          {...register("email", emailValidation)}
          placeholder="Email"
          className="pl-10 pr-4 py-2  w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
        />
        <span className="text-red-500 text-xs">
                        {
                            errors.email?.message
                        }
                    </span>
      </div>

      {/* Input Field - Password */}
      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-violet-500" />
        <input
          id="password"
          type="password"
          {...register("password", passwordValidation)}
          placeholder="Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-blue-500 focus:ring-violet-500"
        />
        <span className="text-red-500 text-xs">
                        {
                            errors.password?.message
                        }
                    </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 hover:to-purple-900 
        text-violet-200 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Login
      </button>

      {/* Links for Forgot Password and Register */}
      <div className="flex justify-between text-sm text-white">
        <Link to="/forgot-password" className="hover:underline">
          Forgot Password?
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </div>
    </form>
    </div>
    // //  </div>


  )
}