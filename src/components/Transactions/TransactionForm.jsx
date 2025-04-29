import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRupeeSign, FaCalendarAlt, FaRegCommentDots, FaWallet } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

export const TransactionForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const transaction = location.state?.transaction || null;
  const user_id = localStorage.getItem("id") || "";
  const role_id = localStorage.getItem("role_id") || "";
  const role_name = localStorage.getItem("role") || "user";

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/getAllCategories");
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showToast("Error fetching categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/getSubCategoryByCategoryId/${categoryId}?user_id=${user_id}&role_name=${role_name}`);
      setSubCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      showToast("Error fetching subcategories", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = watch("type");

  useEffect(() => {
    if (selectedCategory) fetchSubCategories(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (transaction) {
      setValue("type", transaction.category_id?._id || "");
      setValue("amount", transaction.amount || "");
      setValue("category", transaction.subcategory_id?._id || "");
      setValue("date", transaction.date ? transaction.date.split("T")[0] : "");
      setValue("description", transaction.description || "");
    }
  }, [transaction, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        user_id,
        role_id,
        category_id: data.type,
        subcategory_id: data.category,
        amount: data.amount,
        date: data.date,
        description: data.description || "",
      };

      let res;
      if (transaction && transaction._id) {
        res = await axios.put(`/editTransaction/${transaction._id}`, payload);
        showToast(res.data.message || "Transaction updated successfully!", "success");
        navigate("/user/trasactionlists");
      } else {
        res = await axios.post("/addTransaction", payload);
        showToast(res.data.message || "Transaction added successfully!", "success");
      }
    } catch (err) {
      console.error("Error submitting transaction:", err);
      showToast(err?.response?.data?.message || "Failed to save transaction", "error");
    } finally {
      setLoading(false);
    }
  };

  const validationRules = {
    type: { required: "Type is required" },
    amount: {
      required: "Amount is required",
      validate: (val) => parseFloat(val) > 0 || "Amount must be positive",
    },
    category: { required: "Category is required" },
    date: { required: "Date is required" },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-6 transition-colors duration-300">
      {loading && <CustomLoader />}
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

        {/* Type */}
        <div>
          <label htmlFor="type" className="flex items-center gap-2 text-violet-500 font-medium">
            <FaWallet /> Type
          </label>
          <select
            {...register("type", validationRules.type)}
            id="type"
            className="w-full mt-1 p-2 border border-violet-300 rounded-md focus:ring-violet-500"
          >
            <option value="">Select transaction type</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <span className="text-red-500 text-xs">{errors.type?.message}</span>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="text-violet-500 font-medium">
            <FaRupeeSign className="inline mr-2" /> Amount
          </label>
          <input
            type="number"
            id="amount"
            {...register("amount", validationRules.amount)}
            placeholder="Amount"
            className="w-full p-2 border border-violet-300 rounded-md focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.amount?.message}</span>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="text-violet-500 font-medium">
            <FaRegCommentDots className="inline mr-2" /> Category
          </label>
          <select
            id="category"
            {...register("category", validationRules.category)}
            className="w-full p-2 border border-violet-300 rounded-md focus:ring-violet-500"
          >
            <option value="">Select category</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
          <span className="text-red-500 text-xs">{errors.category?.message}</span>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="text-violet-500 font-medium">
            <FaCalendarAlt className="inline mr-2" /> Date
          </label>
          <input
            type="date"
            id="date"
            {...register("date", validationRules.date)}
            className="w-full p-2 border border-violet-300 rounded-md focus:ring-violet-500"
          />
          <span className="text-red-500 text-xs">{errors.date?.message}</span>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="text-violet-500 font-medium">
            <FaRegCommentDots className="inline mr-2" /> Description (optional)
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Description"
            rows="3"
            className="w-full p-2 border border-violet-300 rounded-md focus:ring-violet-500"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-800 hover:to-purple-800 text-violet-100 font-bold py-2 px-4 rounded transition 
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {transaction ? "Update Transaction" : "Submit Transaction"}
        </button>
      </form>
    </div>
  );
};
