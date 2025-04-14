import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit ,FaTrashAlt} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

export const AdminTransactionTypeList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
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
            showToast("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const toggleCategorySelection = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id)
                ? prev.filter((catId) => catId !== id)
                : [...prev, id]
        );
    };

    const handleDeleteSelectedCategories = async () => {
        if (selectedCategories.length === 0) return;
    
        try {
            setLoading(true);
            await axios.post("/delete-selected-categories", {
                category_ids: selectedCategories,
            });
            
            
            setCategories((prev) =>
                prev.filter((cat) => !selectedCategories.includes(cat._id))
            );
            setSelectedCategories([]);
            showToast("Selected categories deleted", "success");
        } catch (error) {
            console.error("Error deleting selected categories:", error);
            showToast("Failed to delete selected categories", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAll = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete ALL categories?");
        if (!confirmDelete) return;
    
        try {
            setLoading(true);
            await axios.delete("/delete-all-categories");
            setCategories([]);  // Clear the category list after deletion
            showToast("All categories deleted", "success");
        } catch (error) {
            console.error("Error deleting all categories:", error);
            showToast("Failed to delete all categories", "error");
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
            {loading && <CustomLoader />}
            <h2 className="text-xl font-semibold mb-4 text-violet-500 text-center">
                Transaction Types
            </h2>

            <div className="mb-4 flex justify-end w-2/3">
               {selectedCategories.length > 0 ? (
                             <button
                               onClick={handleDeleteSelectedCategories}
                               className="bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 hover:to-rose-900 text-red-200 flex items-center gap-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 px-3 py-1 rounded-lg shadow"
                             >
                               <FaTrashAlt />
                               Delete Selected
                             </button>
                           ) : (
                             <button
                               onClick={handleDeleteAll}
                               className="bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 hover:to-rose-900 text-red-200 flex items-center gap-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 px-3 py-1 rounded-lg shadow"
                             >
                               <FaTrashAlt />
                               Delete All
                             </button>
                           )}
            </div>

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
                            <div className="flex items-center space-x-3">
                                
                                <div>
                                    <span className="font-medium text-gray-950 dark:text-white">
                                        {category.name}
                                    </span>
                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">
                                        Type
                                    </span>
                                    <span className="ml-2 text-sm text-gray-950 dark:text-white">
                                        {category.description || "(No Description)"}
                                    </span>
                                </div>
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

                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category._id)}
                                    onChange={() => toggleCategorySelection(category._id)}
                                    className="mr-3 accent-violet-600 w-4 h-4"
                                />

                            
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
