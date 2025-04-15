import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

export const AdminCategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem("id");
            const roleId = localStorage.getItem("role_id");
            const role = localStorage.getItem("role");
    
            if (!roleId || !role) {
                console.error("Missing Role ID or Role in localStorage");
                return;
            }
    
            const params = { role_id: roleId };
            if (role.toLowerCase() !== "admin") {
                if (!userId) {
                    console.error("User ID is required for non-admins");
                    return;
                }
                params.user_id = userId;
            }
    
            const response = await axios.get(`/getAllSubCategories`, { params });
            console.log('Raw response data:', response.data); // Log the raw response before formatting
            
            const formattedCategories = response.data.map(subcategory => ({
                _id: subcategory._id,
                name: subcategory.name,
                category_id: {
                    _id: subcategory.category_id?._id || subcategory.category_id,
                    name: subcategory.category_id?.name || "Unknown Category"
                },
                type: subcategory.category_id?.name?.toLowerCase() || "unknown",
                description:
                    subcategory.description
                        ?.replace(/^\((Userdefined|Admindefined)\)\s*/, "")
                        .trim() || "(No Description)"
            }));
    
            setCategories(formattedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            showToast("Error fetching categories", "error");
        } finally {
            setLoading(false);
        }
    };
    

    const handleDelete = async (id) => {
        setLoading(true); // Start loading when form submission begins
        try {
            const response = await axios.delete(`/deleteSubCategory/${id}`);
            showToast(response.data.message);
            setCategories(categories.filter(category => category._id !== id));
        } catch (error) {
            console.error("Error deleting admin category:", error);
            showToast("Failed to delete category");
        } finally {
            setLoading(false); // Stop loading when the request completes
        }
    };

    const handleDeleteSelectedCategories = async () => {
        if (selectedCategories.length === 0) return;
        setLoading(true);
        try {
            // Send the selected category IDs to the backend for deletion
            await axios.post("/delete-selected-subcategories", { sub_category_ids: selectedCategories });

            // Remove deleted categories from the state
            setCategories(categories.filter(category => !selectedCategories.includes(category._id)));
            setSelectedCategories([]); // Clear selected categories
            showToast("Selected subcategories deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting selected subcategories:", error);
            showToast("Failed to delete selected subcategories", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAllCategories = async () => {
        setLoading(true); // Start loading when form submission begins
        const userId = localStorage.getItem("id");
        const roleId = localStorage.getItem("role_id");

        try {
            // Send the user ID and role ID along with the request to delete all subcategories
            await axios.delete(`/delete-all-subcategories?user_id=${userId}&role_id=${roleId}`);

            // Clear the state after deletion
            setCategories([]);
            showToast("All subcategories deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting all subcategories:", error);
            showToast("Failed to delete all subcategories", "error");
        } finally {
            setLoading(false); // Stop loading when the request completes
        }
    };

    const toggleCategorySelection = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleEdit = (category) => {
        navigate("/admin/addcategory", { state: { category } });
    };

    return (
        <div className="min-h-screen p-4 flex flex-col items-center bg-white dark:bg-gray-950 text-violet-500">
            {loading && <CustomLoader />}
            <h2 className="text-xl font-semibold mb-4 text-violet-500 text-center">All Admin Subcategories</h2>
            <div className="mb-4 flex justify-end w-2/3">
                {/* Dynamic Delete Button */}
                {selectedCategories.length > 0 ? (
                    <button
                        onClick={handleDeleteSelectedCategories}
                        className="mb-4 bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 hover:to-rose-900 
                    text-red-200 flex items-center gap-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-red-600 px-3 py-1 rounded-lg shadow"
                    >
                        <FaTrash />
                        Delete Selected
                    </button>
                ) : (
                    <button
                        onClick={handleDeleteAllCategories}
                        className="mb-4 bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 hover:to-rose-900 
                    text-red-200 flex items-center gap-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-red-600 px-3 py-1 rounded-lg shadow"
                    >
                        <FaTrash />
                        Delete All
                    </button>
                )}
            </div>

            <ul className="mt-4 w-2/3 space-y-4">
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
                            <button
                                onClick={() => handleEdit(category)}
                                className="text-violet-500 hover:text-violet-700"
                            >
                                <FaEdit />
                            </button>

                            <button
                                onClick={() => handleDelete(category._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrash />
                            </button>

                            {/* Checkbox to select category */}
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category._id)}
                                onChange={() => toggleCategorySelection(category._id)}
                                className="mr-3 accent-violet-600 w-4 h-4"
                            />
                        </div>
                    </li>
                ))}
                {categories.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-white">No categories found</p>
                )}
            </ul>
        </div>
    );
};
