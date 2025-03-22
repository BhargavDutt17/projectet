import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

export const CategoriesList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const userId = localStorage.getItem("id");  // ✅ Correct localStorage key

            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }

            // Pass "all" to fetch all subcategories for this user
            const response = await axios.get(`/getSubCategoryByCategoryId/all`, {
                params: { user_id: userId },
            });

            const formattedCategories = response.data.map(subcategory => ({
                _id: subcategory._id,
                name: subcategory.name,
                type: subcategory.category_type || "unknown", // ✅ Use fetched category name
            }));

            setCategories(formattedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };



    const handleDelete = async (id) => {
        console.log("Deleted category with ID:", id);
        // Implement delete API call if needed
    };

    return (
        <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
            <div className="my-4 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-950">
                <h2 className="text-xl font-semibold mb-4 text-violet-500">Categories</h2>
                <div className="mt-6 bg-white dark:bg-gray-950 p-4 rounded-lg shadow-inner">
                    <ul className="space-y-4">
                        {categories.map((category) => (
                            <li
                                key={category._id}
                                className="bg-white dark:bg-slate-700 p-3 rounded-md shadow border border-violet-500 flex justify-between items-center"
                            >

                                <div>
                                    <span className="font-medium text-gray-950 dark:text-white">{category.name}</span>
                                    <span
                                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.type === "income"
                                            ? "bg-green-200 text-green-800"
                                            : "bg-red-200 text-red-800"
                                            }`}
                                    >
                                        {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                                    </span>
                                </div>

                                <div className="flex space-x-3">
                                    <Link to={`/update-category/${category._id}`}>
                                        <button className="text-blue-500 hover:text-blue-700">
                                            <FaEdit />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
