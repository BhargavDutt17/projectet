import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AdminTransactionTypeList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin - Transaction Types"; 
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const userId = localStorage.getItem("id");

            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }

            const response = await axios.get("/getAllCategories");

            const formattedCategories = response.data.map(category => ({
                _id: category._id,
                name: category.name,
                type: category.type || "unknown",
                description: category.description?.trim() || ""
            }));

            setCategories(formattedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/deleteCategory/${id}`);
            alert(response.data.message);
            setCategories(categories.filter(category => category._id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category");
        }
    };


    const handleEdit = (category) => {
        navigate("/admin/addtransactiontype", { state: { category } });
    };

    return (
        <div className="min-h-screen p-4 flex flex-col items-center bg-white dark:bg-gray-950 text-violet-500">
            <h2 className="text-xl font-semibold mb-4 text-violet-500 text-center">
                Transaction Types 
            </h2>

            {loading ? (
                <p className="text-gray-500">Loading categories...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : categories.length === 0 ? (
                <p className="text-gray-500">No categories found.</p>
            ) : (
                <ul className="mt-4 w-2/3 space-y-4">
                    {categories.map((category) => (
                        <li
                            key={category._id}
                            className="bg-white dark:bg-slate-700 p-3 rounded-md shadow border border-violet-500 flex justify-between items-center w-full"
                        >
                            <div>
                                <span className="font-medium text-gray-950 dark:text-white">{category.name}</span>
                                <span
                                className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">
                                    Type
                            </span>
                                <span className="ml-2 text-sm text-gray-950 dark:text-white">
                                    {category.description && category.description.trim() !== ""
                                        ? category.description
                                        : "(No Description)"}
                                </span>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FaEdit />
                                </button>

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
            )}
        </div>
    );
};