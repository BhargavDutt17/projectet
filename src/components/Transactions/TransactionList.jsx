import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import axios from "axios";

export const TransactionList = () => {

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    category: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]); // Stores types (categories)
  const [subCategories, setSubCategories] = useState([]); //Stores subcategories

  // Fetch Transactions from Backend
  const fetchTransactions = async () => {
    try {
      const user_id = localStorage.getItem("id"); //Get logged-in user's ID
      if (!user_id) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await axios.get(`/getTransactionByUserId/${user_id}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
    }
  };

  // Fetch Categories from Backend (Income/Expense)
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/getAllCategories");
      setCategories(response.data); // Set categories (Income/Expense)
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch Subcategories When Type (Category) is Selected
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;

    try {
      const user_id = localStorage.getItem("id") || "";
      const role_id = localStorage.getItem("role_id") || "";

      const response = await axios.get(`/getSubCategoryByCategoryId/${categoryId}`, {
        params: { user_id, role_id }, // Pass user_id and role_id in the request
      });

      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };


  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  // Watch Type Selection and Fetch Subcategories
  useEffect(() => {
    if (filters.type) {
      fetchSubCategories(filters.type);
    } else {
      setSubCategories([]);
      setFilters((prev) => ({ ...prev, category: "" })); 
    }
  }, [filters.type]);

  // Handle Filter Changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply Filters to Transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const isWithinDateRange =
      (!filters.startDate || transactionDate >= new Date(filters.startDate)) &&
      (!filters.endDate || transactionDate <= new Date(filters.endDate));
    const isTypeMatch = !filters.type || transaction.category_id?._id === filters.type;
    const isCategoryMatch =
      !filters.category || transaction.subcategory_id?._id === filters.category;

    return isWithinDateRange && isTypeMatch && isCategoryMatch;
  });

  // Format Date to `DD/MM/YYYY`
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-6 gap-6 ">
        {/* Start Date Filter */}
        <div className="col-span-1">
          <label className="block text-violet-500 text-center">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
                bg-white dark:bg-slate-700 border border-violet-500 "
          />
        </div>

        {/* End Date Filter */}
        <div className="col-span-1">
          <label className="block text-violet-500 text-center">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
                bg-white dark:bg-slate-700 border border-violet-500"
          />
        </div>

        {/* Transaction Type Filter */}
        <div className="relative col-span-1">
          <label className="block text-violet-500 text-center">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
                appearance-none bg-white dark:bg-slate-700 border border-violet-500"
          >
            <option value="">All Types</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/5 text-violet-500" />
        </div>

        {/* Category Filter */}
        <div className="relative col-span-1">
          <label className="block text-violet-500 text-center">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
            appearance-none bg-white dark:bg-slate-700 border border-violet-500"
          >
            <option value="">All Categories</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/5 text-violet-500" />
        </div>

        {/* Generate Report Button */}
        <div className="flex justify-center mt-6 mb-6">
          <button
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
  bg-white dark:bg-violet-700 text-violet-100"
          >
            Generate Report
          </button>
        </div>

        {/* Doenload Report Button */}
        <div className="flex justify-center mt-6 mb-6">
          <button
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
  bg-white dark:bg-violet-700 text-violet-100"
          >
            Download Report
          </button>
        </div>
      </div>

      

      {/* Transaction List */}
      <div className="my-4 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-950 ">
        <div className="mt-6 bg-white dark:bg-gray-950 p-4 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-violet-500">
            Filtered Transactions
          </h3>
          <ul className="list-disc pl-5 space-y-2 ">
            {filteredTransactions.map((transaction) => (
              <li
                key={transaction._id}
                className="bg-white dark:bg-slate-700 p-3 rounded-md shadow border border-violet-500 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-gray-950 dark:text-white">
                    {formatDate(transaction.date)}
                  </span>
                  <span
                    className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.category_id?.name === "Income"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                      }`}
                  >
                    {transaction.category_id?.name || "N/A"}
                  </span>
                  <span className="ml-2 text-gray-950 dark:text-white">
                    {transaction.subcategory_id?.name || "N/A"} - ₹
                    {transaction.amount.toLocaleString()}
                  </span>
                  <span className="ml-2 text-sm text-gray-950 dark:text-white">
                    {transaction.description}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => alert(`Edit transaction ${transaction._id}`)}
                    className="text-violet-500 hover:text-violet-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => alert(`Delete transaction ${transaction._id}`)}
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
