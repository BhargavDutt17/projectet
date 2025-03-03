import React from 'react'
import { useForm } from "react-hook-form";
import {
  FaWallet,
} from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";

export const AddCategory = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Category added:", data);
        alert("Category added successfully");
    };

    // Validation rules
    const typeValidation = {
        required: "Category type is required",
    };

    const nameValidation = {
        required: "Category name is required",
        minLength: {
            value: 3,
            message: "Category name must be at least 3 characters long",
        },
    };
  return (
    <div className='min-h-screen bg-white dark:bg-gray-950 pt-6 transition-colors duration-300'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-lg mx-auto my-10 bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg space-y-6 border border-violet-500"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-violet-500">
                        Add New Category
                    </h2>
                    <p className="text-violet-500 font-medium">Fill in the details below.</p>
                </div>

                {/* Category Type */}
                <div className="space-y-2">
                    <label
                        htmlFor="type"
                        className="flex gap-2 items-center text-violet-500 font-medium"
                    >
                        <FaWallet className="text-violet-500" />
                        <span>Type</span>
                    </label>
                    <select
                        {...register("type", typeValidation)}
                        id="type"
                        className="w-full p-2 mt-1 border border-violet-300 rounded-md shadow-sm  
                        focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50"
                    >
                        <option value="">Select transaction type</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <span className="text-red-500 text-xs">
                        {
                            errors.type?.message
                        }
                    </span>
                </div>

                {/* Category Name */}
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-violet-500 font-medium">
                        <SiDatabricks className="inline mr-2 text-violet-500" />
                        Name
                    </label>
                    <input
                        type="text"
                        {...register("name", nameValidation)}
                        placeholder="Name"
                        id="name"
                        className="w-full mt-1 border border-violet-300 rounded-md shadow-sm 
                        focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 py-2 px-3"
                    />
                    <span className="text-red-500 text-xs">
                        {
                            errors.name?.message
                        }
                    </span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-800 hover:to-purple-800 
                    text-violet-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 transform"
                >
                    Add Category
                </button>
            </form>
        </div>
  )
}

