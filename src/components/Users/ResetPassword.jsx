import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaLock } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false); // Add loading state

  const onSubmit = async ({ password }) => {
    setLoading(true); // Start loading when form submission begins
    try {
      const res = await axios.post('/users/resetpassword/', {
        token,
        password
      });
      showToast(res.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showToast( error.response?.data?.message ||"Failed to reset password. Link may be expired.","error");
    }finally {
      setLoading(false); // Stop loading when the request completes
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-1 transition-colors duration-300">
      {loading && <CustomLoader />}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg space-y-6 border border-violet-500">
        <h2 className="text-3xl font-semibold text-center text-violet-500">Reset Password</h2>
        <p className="text-sm text-center text-violet-500 font-medium">Enter a new password</p>

        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-violet-500" />
          <input
            type="password"
            placeholder="New password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 5, message: "Minimum 5 characters required" }
            })}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.password?.message}</span>
        </div>

        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-violet-500" />
          <input
            type="password"
            placeholder="Confirm password"
            {...register("confirm", {
              validate: value => value === watch("password") || "Passwords do not match"
            })}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.confirm?.message}</span>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 hover:to-purple-900 text-violet-200 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
