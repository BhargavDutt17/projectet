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
            const roleId = localStorage.getItem("role_id"); // Should be the actual role ObjectId
      

    
            if (!userId || !roleId) {
                console.error("User ID or Role ID not found in localStorage");
                return;
            }
    
            // If admin, only pass role_id to get all admin-created subcategories
            const role = localStorage.getItem("role");
            const params = role === "admin"
              ? { role_id: roleId }
              : { user_id: userId, role_id: roleId };
            
    
            const response = await axios.get(`/getAllSubCategories`, { params });
    
            const formattedCategories = response.data.map(subcategory => ({
                _id: subcategory._id,
                name: subcategory.name,
                type: subcategory.category_type || "unknown",
                description: subcategory.description?.trim() || ""
            }));
    
            console.log("Formatted Categories:", formattedCategories);
            setCategories(formattedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    
    
    

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/admin/deleteSubCategory/${id}`);
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
            <h2 className="text-xl font-semibold mb-4 text-violet-500 text-center">All Subcategories</h2>

            <ul className="mt-4 w-2/3 space-y-4">
                {categories.map((category) => (
                    <li
                        key={category._id}
                        className="bg-white dark:bg-slate-700 p-3 rounded-md shadow border border-violet-500 flex justify-between items-center w-full"
                    >
                        <div>
                            <span className="font-medium text-gray-950 dark:text-white">{category.name}</span>
                            <span
                                className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    category.type === "income"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-red-200 text-red-800"
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

