import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaWallet } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { MdDescription } from "react-icons/md"; 

export const AdminAddCategory = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [categories, setCategories] = useState([]);

    // Fetch admin_id and admin_role from localStorage
    const admin_id = localStorage.getItem("id") || "";  
    const admin_role = localStorage.getItem("role") || "";

    console.log("Admin ID:", admin_id);  // Debugging
    console.log("Admin Role:", admin_role);

    // Fetch Categories (Income/Expense)
    const fetchCategories = async () => {
        try {
            const response = await axios.get("/getAllCategories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle Category Selection Change
    const handleCategoryChange = (event) => {
        setValue("category_id", event.target.value);
    };

    // Handle Form Submission (Admin-Defined Subcategories)
    const onSubmit = async (data) => {
        try {
            const subCategoryData = {
                name: data.name.trim(),
                category_id: data.category_id,
                description: `(Admindefined) ${data.description.trim() || ""}`,
                created_by: { user_id: admin_id, role: admin_role } //Matches backend format
            };
    
            console.log("Payload being sent:", subCategoryData);
    
            // Corrected API Call
            const response = await axios.post("/addSubCategory", subCategoryData);
    
            alert(response.data.message);
            fetchCategories();
        } catch (error) {
            console.error("Error adding subcategory:", error.response?.data || error.message);
            alert("Failed to add subcategory");
        }
    };
    

    // Validation Rules
    const typeValidation = { required: "Category type is required" };
    const nameValidation = {
        required: "Category name is required",
        minLength: { value: 3, message: "Category name must be at least 3 characters long" },
    };
    const descriptionValidation = {
        minLength: { value: 5, message: "Description must be at least 5 characters long" },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-6 transition-colors duration-300">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-lg mx-auto bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg space-y-6 border border-violet-500"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-violet-500">
                        Add Global Categories
                    </h2>
                    <p className="text-violet-500 font-medium">Fill in the details below.</p>
                </div>

                {/* 🔹 Category Type (Income/Expense) */}
                <div className="space-y-2">
                    <label className="flex gap-2 items-center text-violet-500 font-medium">
                        <FaWallet className="text-violet-500" />
                        <span>Type</span>
                    </label>
                    <select
                        {...register("category_id", typeValidation)}
                        onChange={handleCategoryChange}
                        className="w-full p-2 border border-violet-300 rounded-md focus:border-violet-500 focus:ring-violet-500"
                    >
                        <option value="">Select transaction type</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    <span className="text-red-500 text-xs">{errors.category_id?.message}</span>
                </div>

                {/* 🔹 Category Name */}
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-violet-500 font-medium">
                        <SiDatabricks className="inline mr-2 text-violet-500" />
                        Name
                    </label>
                    <input
                        type="text"
                        {...register("name", nameValidation)}
                        placeholder="Enter subcategory name"
                        id="name"
                        className="w-full mt-1 border border-violet-300 rounded-md shadow-sm 
                        focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 py-2 px-3"
                    />
                    <span className="text-red-500 text-xs">{errors.name?.message}</span>
                </div>

                {/* 🔹 Description Field */}
                <div className="flex flex-col">
                    <label htmlFor="description" className="text-violet-500 font-medium">
                        <MdDescription className="inline mr-2 text-violet-500" />
                        Description
                    </label>
                    <textarea
                        {...register("description", descriptionValidation)}
                        placeholder="Explain why and what this category is for"
                        id="description"
                        className="w-full mt-1 border border-violet-300 rounded-md shadow-sm 
                        focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 py-2 px-3"
                    />
                    <span className="text-red-500 text-xs">{errors.description?.message}</span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-800 hover:to-purple-800 
                    text-violet-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                >
                    Add Subcategory
                </button>
            </form>
        </div>
    );
};
