import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaWallet } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { MdDescription } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

export const AddCategory = () => {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    
    const user_id = localStorage.getItem("id") || "";
    const role_id = localStorage.getItem("role_id") || "";
    const role_name = localStorage.getItem("role") || "user";

    // Get category data if editing
    const editingCategory = location.state?.category || null;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/getAllCategories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();

        if (editingCategory) {
            setValue("name", editingCategory.name);
            setValue("category_id", editingCategory.category_id);
            setValue("description", editingCategory.description || ""); // Ensure description is set
        }
    }, [editingCategory, setValue]);

    const onSubmit = async (data) => {
        try {
            const categoryData = {
                name: data.name,
                category_id: data.category_id,
                description: `(Userdefined) ${data.description.trim() || ""}`, // Ensure description is never undefined
                user_id,
                role_id,
                role_name
            };

            console.log("Saving category with data:", categoryData); // Debugging log

            let response;
            if (editingCategory) {
                response = await axios.put(`/editSubcategory/${editingCategory._id}`, categoryData);
                if (response.status === 200) {
                    alert(response.data.message);
                    navigate("/user/categorieslist"); // Redirect after update
                }
            } else {
                response = await axios.post("/addSubCategory", categoryData);
                if (response.status === 201) {
                    alert(response.data.message);
                    reset(); // Clear form fields after adding a new category
                }
            }
        } catch (error) {
            console.error("Error saving category:", error.response?.data || error.message);
            alert("Failed to save category");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-6 transition-colors duration-300">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-lg mx-auto bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg space-y-6 border border-violet-500"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-violet-500">
                        {editingCategory ? "Edit Category" : "Add Custom Category"}
                    </h2>
                </div>

                <div className="space-y-2">
                    <label className="flex gap-2 items-center text-violet-500 font-medium">
                        <FaWallet className="text-violet-500" />
                        <span>Type</span>
                    </label>
                    <select
                        {...register("category_id", { required: "Category type is required" })}
                        className="w-full p-2 border border-violet-300 rounded-md focus:border-violet-500 focus:ring-violet-500"
                    >
                        <option value="">Select transaction type</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    <span className="text-red-500 text-xs">{errors.category_id?.message}</span>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="name" className="text-violet-500 font-medium">
                        <SiDatabricks className="inline mr-2 text-violet-500" />
                        Name
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: "Category name is required", minLength: 3 })}
                        placeholder="Enter subcategory name"
                        id="name"
                        className="w-full mt-1 border border-violet-300 rounded-md py-2 px-3 focus:border-violet-500 focus:ring-violet-500"
                    />
                    <span className="text-red-500 text-xs">{errors.name?.message}</span>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="description" className="text-violet-500 font-medium">
                        <MdDescription className="inline mr-2 text-violet-500" />
                        Description
                    </label>
                    <textarea
                        {...register("description", { minLength: 5 })}
                        placeholder="Explain why and what this category is for"
                        id="description"
                        className="w-full mt-1 border border-violet-300 rounded-md py-2 px-3 focus:border-violet-500 focus:ring-violet-500"
                    />
                    <span className="text-red-500 text-xs">{errors.description?.message}</span>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-800 hover:to-purple-800 text-violet-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                >
                    {editingCategory ? "Update Category" : "Add Subcategory"}
                </button>
            </form>
        </div>
    );
};