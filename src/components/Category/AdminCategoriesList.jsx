import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AdminCategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const userId = localStorage.getItem("id");
            const roleId = localStorage.getItem("role_id");
            const role = localStorage.getItem("role");

            if (!userId || !roleId || !role) {
                console.error("Missing role or user_id");
                return;
            }

            const response = await axios.get(`/getSubCategoryByCategoryId/all`, {
                params: { user_id: userId, role_id: roleId }
            });


            const formattedCategories = response.data.map(subcategory => ({
                _id: subcategory._id,
                name: subcategory.name,
                category_id: {
                    _id: subcategory.category_id?._id || subcategory.category_id,
                    name: subcategory.category_id?.name || "Unknown Category"
                },
                type: subcategory.category_id?.name?.toLowerCase() || "unknown",  // Standardize type to lowercase for comparison
                description: subcategory.description
                    ?.replace(/^\((Userdefined|Admindefined)\)\s*/, "")
                    .trim() || "(No Description)"
            }));
            setCategories(formattedCategories);
        } catch (error) {
            console.error("Error fetching admin subcategories:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/deleteSubCategory/${id}`);
            alert(response.data.message);
            setCategories(categories.filter(category => category._id !== id));
        } catch (error) {
            console.error("Error deleting admin category:", error);
            alert("Failed to delete category");
        }
    };

    const handleEdit = (category) => {
        navigate("/admin/addcategory", { state: { category } });
    };

    return (
        <div className="min-h-screen p-4 flex flex-col items-center bg-white dark:bg-gray-950 text-violet-500">
            <h2 className="text-xl font-semibold mb-4 text-violet-500 text-center">All Admin Subcategories</h2>

            <button
                onClick={() => navigate("/admin/addcategory")}
                className="mb-4 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded"
            >
                Add New Subcategory
            </button>

            <ul className="mt-4 w-2/3 space-y-4">
                {categories.map((category) => (
                    <li
                        key={category._id}
                        className="bg-white dark:bg-slate-700 p-3 rounded-md shadow border border-violet-500 flex justify-between items-center w-full"
                    >
                        <div>
                            <span className="font-medium text-gray-950 dark:text-white">{category.name}</span>
                            <span
                                className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.type === "income"
                                    ? "bg-green-200 text-green-800"
                                    : category.type === "expense"  // Check for "expense" as well
                                        ? "bg-red-200 text-red-800"
                                        : "bg-gray-200 text-gray-800"  // Fallback if neither "income" nor "expense"
                                    }`}
                            >
                                {category.type
                                    ? category.type.charAt(0).toUpperCase() + category.type.slice(1)
                                    : "Unknown"}
                            </span>
                            <span className="ml-2 text-sm text-gray-950 dark:text-white">
                                {category.description && category.description.trim() !== "" ? category.description : "(No Description)"}
                            </span>
                        </div>

                        <div className="flex space-x-3">
                            <button onClick={() => handleEdit(category)} className="text-blue-500 hover:text-blue-700">
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
        </div>
    );
};
