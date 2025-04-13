import React from 'react';
import { useForm } from "react-hook-form";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios"; // Import axios for API calls

export const Login = ({ setRole }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate(); // Initialize useNavigate

  const onSubmit = async (data) => {
    const formattedData = {
      email_or_username: data.email_or_username.trim(),
      password: data.password,
    };

    try {
      const res = await axios.post("/users/login/", formattedData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        localStorage.setItem("id", res.data.user._id);
        localStorage.setItem("role", res.data.user.role.name);
        localStorage.setItem("role_id", res.data.user.role._id);

        setRole(res.data.user.role.name);

        if (res.data.user.role.name === "user") {
          navigate("/user/dashboard");
        } else if (res.data.user.role.name === "admin") {
          navigate("/admin/dashboard");
        }
      }
    }
    catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Error logging in. Please check your credentials.");
    }
  };

  // Validation rules
  const emailValidation = {
    required: "Email or Username is required",
    validate: (value) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const usernamePattern = /^[a-zA-Z0-9_.-]+$/; // Allow alphanumeric usernames with dots, underscores, and dashes

      if (!emailPattern.test(value) && !usernamePattern.test(value)) {
        return "Invalid email or username format";
      }
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
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-1 transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg space-y-6 border border-violet-500"
      >
        <h2 className="text-3xl font-semibold text-center text-violet-500">Login</h2>
        <p className="text-sm text-center text-violet-500 font-medium">Login to your account</p>

        {/* Input Field - Email */}

        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-violet-500" />
          <input
            id="email_or_username"
            type="text"
            {...register("email_or_username", emailValidation)}
            placeholder="Email or Username"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.email_or_username?.message}</span>

        </div>



        {/* Input Field - Password */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-violet-500" />
          <input
            id="password"
            type="password"
            {...register("password", passwordValidation)}
            placeholder="Password"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.password?.message}</span>
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
          <Link to="/forgotpassword" className="text-violet-300 hover:underline">Forgot Password?</Link>
          <Link to="/activate" className="text-violet-300 hover:underline">Reactivate your account</Link>
        </div>
      </form>
    </div>
  );
};