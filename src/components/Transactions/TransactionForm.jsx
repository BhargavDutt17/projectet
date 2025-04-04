import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRupeeSign, FaCalendarAlt, FaRegCommentDots, FaWallet } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const TransactionForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const transaction = location.state?.transaction || null;

  // Fetch user_id and role_id from localStorage
  const user_id = localStorage.getItem("id") || "";
  const role_id = localStorage.getItem("role_id") || "";

  // Fetch categories (Income/Expense)
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/getAllCategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      let url = `/getSubCategoryByCategoryId/${categoryId}`;
      const role_name = localStorage.getItem("role") || "user";
      url += `?user_id=${user_id}&role_name=${role_name}`;
      const response = await axios.get(url);
      setSubCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Watch category selection
  const selectedCategory = watch("type");
  useEffect(() => {
    if (selectedCategory) fetchSubCategories(selectedCategory);
  }, [selectedCategory]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Prefill form when editing a transaction
  useEffect(() => {
    if (transaction) {
      setValue("type", transaction.category_id?._id || "");
      setValue("amount", transaction.amount || "");
      setValue("category", transaction.subcategory_id?._id || "");
      setValue("date", transaction.date ? transaction.date.split("T")[0] : "");
      setValue("description", transaction.description || "");
    }
  }, [transaction, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const transactionData = {
        user_id,
        role_id,
        category_id: data.type,
        subcategory_id: data.category,
        amount: data.amount,
        date: data.date,
        description: data.description || "",
      };

      let response;
      if (transaction && transaction._id) {
        response = await axios.put(`/editTransaction/${transaction._id}`, transactionData);
        alert(response.data.message);
        navigate("/user/trasactionlists"); // Redirect only on update
      } else {
        response = await axios.post("/addTransaction", transactionData);
        alert(response.data.message);
        // Stay on the same page after adding a transaction
      }

    } catch (error) {
      console.error("Error submitting transaction:", error.response?.data || error.message);
      alert(`Failed to save transaction: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  // Validation rules
  const validationRules = {
    type: { required: { value: true, message: "Type is required" } },
    amount: {
      required: { value: true, message: "Amount is required" },
      validate: (value) => value > 0 || "Amount must be positive",
    },
    category: { required: { value: true, message: "Category is required" } },
    date: { required: { value: true, message: "Date is required" } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-6 transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg space-y-3 border border-violet-500"
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-violet-500">
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <p className="text-violet-500 font-medium">Fill in the details below.</p>
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <label htmlFor="type" className="flex gap-2 items-center text-violet-500 font-medium">
            <FaWallet className="text-violet-500" />
            <span>Type</span>
          </label>
          <select {...register("type", validationRules.type)}
            id="type"
            className="block w-full p-2 mt-1 border border-violet-300 rounded-md shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50">
            <option value="">Select transaction type</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <span className="text-red-500 text-xs">{errors.type?.message}</span>
        </div>

        {/* Amount */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="amount" className="text-violet-500 font-medium">
            <FaRupeeSign className="inline mr-2 text-violet-500" /> Amount
          </label>
          <input type="number" {...register("amount", validationRules.amount)}
            id="amount"
            placeholder="Amount"
            className="w-full border border-violet-300 rounded-md shadow-sm py-2 px-3 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50" />
          <span className="text-red-500 text-xs">{errors.amount?.message}</span>
        </div>

        {/* Category */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="category" className="text-violet-500 font-medium">
            <FaRegCommentDots className="inline mr-2 text-violet-500" /> Category
          </label>
          <select {...register("category", validationRules.category)}
            id="category"
            className="w-full border border-violet-300 rounded-md shadow-sm py-2 px-3 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50">
            <option value="">Select a category</option>
            {subCategories.map((subCat) => (
              <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
            ))}
          </select>
          <span className="text-red-500 text-xs">{errors.category?.message}</span>
        </div>

        {/* Date Field */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="date" className="text-violet-500 font-medium">
            <FaCalendarAlt className="inline mr-2 text-violet-500" /> Date
          </label>
          <input type="date" {...register("date", validationRules.date)}
            id="date"
            className="w-full border border-violet-300 rounded-md shadow-sm py-2 px-3 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50" />
          <span className="text-red-500 text-xs">{errors.date?.message}</span>
        </div>

        {/* Description Field */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="description" className="text-violet-500 font-medium">
            <FaRegCommentDots className="inline mr-2 text-violet-500" /> Description (Optional)
          </label>
          <textarea {...register("description")}
            id="description"
            placeholder="Description"
            rows="3"
            className="w-full border border-violet-300 rounded-md shadow-sm py-2 px-3 
                        focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50"></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-800 hover:to-purple-800 text-violet-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
          {transaction ? "Update Transaction" : "Submit Transaction"}
        </button>
      </form>
    </div>
  );
};