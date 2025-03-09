import React from 'react';
import { useForm } from "react-hook-form";
import { FaUser  , FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const Register = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formattedData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
      inviteCode: data.inviteCode || "",
      role_id: "", // You can set this based on your logic
      status: "active"
    };

    try {
      const response = await axios.post("/users/", formattedData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.message) {
        alert("Registration successful!");
        navigate("/login"); // Redirect to login
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Error registering. Please check console for details.");
    }
  };

  // Validation rules
  const nameValidation = { required: "This field is required" };
  const usernameValidation = { required: "Username is required" };
  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address"
    }
  };
  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long"
    }
  };
  const confirmPasswordValidation = {
    required: {
      value: true,
      message: "Confirming your password is required",
    },
    validate: {
      value: (value) => {
        const { password } = getValues();
        return value.trim() === password.trim() || "Passwords must match";
      },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto bg-white dark:bg-slate-700 p-6 rounded-xl border border-violet-500 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-violet-500">Sign Up</h2>
        <p className="text-sm text-center text-violet-500 font-medium">Manage your expenses with us</p>

        {/* First Name */}
        <div className="relative">
          <FaUser   className="absolute top-3 left-3 text-violet-500" />
          <input id="firstName" type="text" {...register("firstName", nameValidation)} placeholder="First Name"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
          <span className="text-red-500 text-xs">{errors.firstName?.message}</span>
        </div>

        {/* Last Name */}
        <div className="relative">
          <FaUser   className="absolute top-3 left-3 text-violet-500" />
          <input id="lastName" type="text" {...register("lastName", nameValidation)} placeholder="Last Name"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
          <span className="text-red-500 text-xs">{errors.lastName?.message}</span>
        </div>

        {/* Input Field - Username */}
        <div className="relative">
          <FaUser   className="absolute top-3 left-3 text-violet-500" />
          <input
            id="username"
            type="text"
            {...register("username", usernameValidation)}
            placeholder="Username"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.username?.message}</span>
        </div>

        {/* Input Field - Email */}
        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-violet-500" />
          <input
            id="email"
            type="email"
            {...register("email", emailValidation)}
            placeholder="Email"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.email?.message}</span>
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

        {/* Input Field - Confirm Password */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-violet-500" />
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", confirmPasswordValidation)}
            placeholder="Confirm Password"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.confirmPassword?.message}</span>
        </div>

        <div className="relative">
          <FaKey className="absolute top-3 left-3 text-violet-500" />
          <input
            id="inviteCode"
            type="text"
            {...register("inviteCode")} // Invite code is now optional
            placeholder="Admin Invite Code (optional)"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 hover:to-purple-900 
          text-violet-200 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Register
        </button>
      </form>
    </div>
  );
};