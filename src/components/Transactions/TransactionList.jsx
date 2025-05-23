import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaTrashAlt } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

export const TransactionList = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    category: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [reportUrl, setReportUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const user_id = localStorage.getItem("id");
      if (!user_id) {
        showToast("User ID not found", "error");
        return;
      }

      const response = await axios.get(`/getTransactionByUserId/${user_id}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showToast("Error fetching user transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/getAllCategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Error fetching categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const user_id = localStorage.getItem("id") || "";
      const role_id = localStorage.getItem("role_id") || "";
      const response = await axios.get(`/getSubCategoryByCategoryId/${categoryId}`, {
        params: { user_id, role_id },
      });
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      showToast("Error fetching subcategories", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestReport = async () => {
    try {
      setLoading(true);
      const user_id = localStorage.getItem("id");
      if (!user_id) {
        showToast("User ID not found", "error");
        return;
      }
      const response = await axios.get(`/getLatestTransactionReport/${user_id}`);
      setReportUrl(response.data.report_file_url || null);
    } catch (error) {
      console.error("Error fetching report:", error);
      showToast("Error fetching report", "error");
      setReportUrl(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchLatestReport();
  }, []);

  useEffect(() => {
    if (filters.type) {
      fetchSubCategories(filters.type);
    } else {
      setSubCategories([]);
      setFilters((prev) => ({ ...prev, category: "" }));
    }
  }, [filters.type]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const inRange =
      (!filters.startDate || transactionDate >= new Date(filters.startDate)) &&
      (!filters.endDate || transactionDate <= new Date(filters.endDate));
    const typeMatch = !filters.type || transaction.category_id?._id === filters.type;
    const categoryMatch =
      !filters.category || transaction.subcategory_id?._id === filters.category;
    return inRange && typeMatch && categoryMatch;
  });

  const generateReport = async () => {
    try {
      setLoading(true);
      const user_id = localStorage.getItem("id");
      const startDate = filters.startDate ? filters.startDate.split("-").reverse().join("/") : "";
      const endDate = filters.endDate ? filters.endDate.split("-").reverse().join("/") : "";

      const params = new URLSearchParams({ user_id, start_date: startDate, end_date: endDate });
      if (filters.type) params.append("category_id", filters.type);
      if (filters.category) params.append("subcategory_id", filters.category);

      const response = await axios.post(`/generateTransactionReport?${params.toString()}`);
      if (response.data.report_file_url) {
        showToast("Report generated successfully!");
        setReportUrl(response.data.report_file_url);
      } else {
        showToast("Failed to generate report", "error");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      showToast("Error generating report", "error");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleEditTransaction = (transaction) => {
    navigate("/user/addtransaction", { state: { transaction } });
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      setLoading(true);
      const user_id = localStorage.getItem("id");
      if (!user_id) {
        showToast("User ID not found. Please log in.", "error");
        return;
      }

      const response = await axios.delete(`/deleteTransaction/${transactionId}`, {
        params: { user_id },
      });

      if (response.status === 200) {
        showToast("Transaction deleted successfully!");
        fetchTransactions();
      } else {
        showToast("Failed to delete transaction", "error");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showToast("Error deleting transaction. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleTransactionSelection = (id) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedTransactions.length === 0) return;
    try {
      setLoading(true);
      const user_id = localStorage.getItem("id");
      await axios.post(`/transactions/delete-selected?user_id=${user_id}`, {
        transaction_ids: selectedTransactions,
      });
      showToast("Selected transactions deleted");
      fetchTransactions();
      setSelectedTransactions([]);
    } catch (error) {
      console.error("Error deleting selected:", error);
      showToast("Failed to delete selected", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      const user_id = localStorage.getItem("id");
      await axios.delete(`/all-transactions/${user_id}`);
      showToast("All transactions deleted");
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting all:", error);
      showToast("Failed to delete all", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <CustomLoader />}
      <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-6 gap-6 rounded-lg">
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
            <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/3 text-violet-500" />
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
            <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/4 text-violet-500" />
          </div>

          {/* Generate Report Button */}
          <div className="flex justify-center mt-6 mb-6">
            <button onClick={generateReport}
              className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
  bg-violet-700 text-violet-100"
            >
              Generate Report
            </button>
          </div>

          {/* Doenload Report Button */}
          <div className="flex justify-center mt-6 mb-6">
            <button
              onClick={() => {
                if (reportUrl) {
                  const link = document.createElement('a');
                  link.href = reportUrl;
                  link.download = 'Transaction_Report'; // Optional: You can specify the filename here
                  link.click(); // Trigger the download
                } else {
                  alert("No report available. Please generate one first.");
                }
              }}
              className={`w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 
      focus:ring-opacity-50 bg-violet-700 text-violet-100 
      ${!reportUrl ? "opacity-50 cursor-not-allowed" : ""}`} // Disable button if no report
              disabled={!reportUrl}
            >
              Download Report
            </button>
          </div>

        </div>

        <div className="my-4 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-950">
          <div className="mt-6 bg-white dark:bg-gray-950 p-4 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-violet-500">Filtered Transactions</h3>
              {selectedTransactions.length > 0 ? (
                <button
                  onClick={handleDeleteSelected}
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

            {loading && <CustomLoader />}
            <ul className="list-disc pl-5 space-y-2">
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
                        : "bg-red-200 text-red-800"}`}
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
                  <div className="flex space-x-3 items-center">
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      className="text-violet-500 hover:text-violet-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction._id)}
                      onChange={() => toggleTransactionSelection(transaction._id)}
                      className="ml-3 accent-violet-600 w-4 h-4"
                    />
                  </div>
                </li>
              ))}
              {filteredTransactions.length === 0 && (
                <p className="text-center text-gray-500 dark:text-white">No transactions found</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
