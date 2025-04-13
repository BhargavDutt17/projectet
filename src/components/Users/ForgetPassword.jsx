import React from 'react';
import { useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

const ForgetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async ({ email }) => {
        try {
            const formData = new FormData();
            formData.append("email", email);
            const res = await axios.post("/forgotpassword?email=" + email);
            alert(res.data.message);

        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert("Email not found or server error.");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-1 transition-colors duration-300">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg space-y-6 border border-violet-500">
                <h2 className="text-3xl font-semibold text-center text-violet-500">Forgot Password</h2>
                <p className="text-sm text-center text-violet-500 font-medium">Enter your email to get reset link</p>

                <div className="relative">
                    <FaUser className="absolute top-3 left-3 text-violet-500" />
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email address",
                            },
                        })}
                        className="pl-10 pr-4 py-2 w-full rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                    <span className="text-red-500 text-xs">{errors.email?.message}</span>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 hover:to-purple-900 text-violet-200 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                    Send Reset Link
                </button>
            </form>
        </div>
    );
};

export default ForgetPassword;
