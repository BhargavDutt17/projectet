import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

export const Register = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  // Handle Profile Image Change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      showToast("No image selected.", "info"); // added user feedback
      return;
    }
    setProfileImage(file);
  };


  const onSubmit = async (data) => {
    setLoading(true); // Start loading when form submission begins
    const formData = new FormData();
    formData.append("firstName", data.firstName.trim());
    formData.append("lastName", data.lastName.trim());
    formData.append("username", data.username.trim());
    formData.append("email", data.email.trim());
    formData.append("password", data.password);
    formData.append("inviteCode", data.inviteCode || "");
    formData.append("role_id", ""); // You can set this based on your logic
    formData.append("status", "active");

    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    // No major changes needed; just improving one area

    try {
      const response = await axios.post("/users/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast(response.data.message || "Registration successful!", "success");
      navigate("/login"); // Redirect to login
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      showToast(
        error.response?.data?.message || "Error registering. Please check console for details.",
        "error"
      );
    } finally {
      setLoading(false); // Stop loading when the request completes
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
      {/* Show loader if registration is in progress */}
      {loading && <CustomLoader />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto bg-white dark:bg-slate-700 p-6 rounded-xl border border-violet-500 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-violet-500">Sign Up</h2>
        <p className="text-sm text-center text-violet-500 font-medium">Manage your expenses with us</p>

        {/* Profile Picture Upload */}
        <div className="relative flex flex-col items-center">
          <label className="cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="w-12 h-12 rounded-full border border-violet-300 flex items-center justify-center">
              {profileImage ? (
                <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" className="w-full h-full rounded-full" />
              ) : (
                <IoPersonCircleOutline className="text-violet-500 w-10 h-10" />
              )}
            </div>
          </label>
          <span className="text-sm font-medium text-violet-500 mt-2">Upload Profile Picture</span>
        </div>

        {/* First Name */}
        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-violet-500" />
          <input id="firstName" type="text" {...register("firstName", nameValidation)} placeholder="First Name"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
          <span className="text-red-500 text-xs">{errors.firstName?.message}</span>
        </div>

        {/* Last Name */}
        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-violet-500" />
          <input id="lastName" type="text" {...register("lastName", nameValidation)} placeholder="Last Name"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
          <span className="text-red-500 text-xs">{errors.lastName?.message}</span>
        </div>

        {/* Username */}
        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-violet-500" />
          <input id="username" type="text" {...register("username", usernameValidation)} placeholder="Username"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
          <span className="text-red-500 text-xs">{errors.username?.message}</span>
        </div>

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-violet-500" />
          <input id="email" type="email" {...register("email", emailValidation)} placeholder="Email"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
          <span className="text-red-500 text-xs">{errors.email?.message}</span>
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-violet-500" />
          <input id="password" type="password" {...register("password", passwordValidation)} placeholder="Password"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
          <span className="text-red-500 text-xs">{errors.password?.message}</span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-violet-500" />
          <input id="confirmPassword" type="password" {...register("confirmPassword", confirmPasswordValidation)} placeholder="Confirm Password"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
          <span className="text-red-500 text-xs">{errors.confirmPassword?.message}</span>
        </div>

        {/* Invite Code */}
        <div className="relative">
          <FaKey className="absolute top-3 left-3 text-violet-500" />
          <input id="inviteCode" type="text" {...register("inviteCode")} placeholder="Admin Invite Code (optional)"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-violet-200 font-bold py-2 px-4 rounded-md transition duration-150">
          Register
        </button>
      </form>
    </div>
  );
};
