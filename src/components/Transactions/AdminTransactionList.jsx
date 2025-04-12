import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { MdCancel } from "react-icons/md";

export const AdminTransactionList = () => {
  const location = useLocation();
  const user_id = location.state?.user_id || localStorage.getItem("selected_user_id");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    category: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/getTransactionByUserId/${user_id}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/getAllCategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await axios.get(`/getSubCategoryByCategoryId/${categoryId}`, {
        params: { user_id },
      });
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleUserSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(`/admin/getTransactionsByUserSearch?q=${searchTerm}`);
      setTransactions(response.data || []);

      if (response.data.length > 0 && response.data[0].user_id?._id) {
        const searchedUserId = response.data[0].user_id._id;
        localStorage.setItem("selected_user_id", searchedUserId); // update globally
      }
    } catch (error) {
      console.error("Error searching transactions:", error);
      alert("No user or transactions found.");
    }
  };


  useEffect(() => {
    fetchTransactions();
    fetchCategories();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${date.getFullYear()}`;
  };

  const generateReport = async () => {
    const updatedUserId = localStorage.getItem("selected_user_id");

    if (!updatedUserId) {
      alert("User ID not found.");
      return;
    }

    const params = {
      user_id: updatedUserId,
    };

    if (filters.startDate) {
      params.start_date = filters.startDate.split("-").reverse().join("/");
    }
    if (filters.endDate) {
      params.end_date = filters.endDate.split("-").reverse().join("/");
    }
    if (filters.type) {
      params.category_id = filters.type;
    }
    if (filters.category) {
      params.subcategory_id = filters.category;
    }

    try {
      const response = await axios.get("/admin/generateTransactionReport", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transaction_report_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    }
  };



  // const navigate = useNavigate();

  // const handleEditTransaction = (transaction) => {
  //   navigate("/user/addtransaction", { state: { transaction } });
  // };

  // const handleDeleteTransaction = async (transactionId) => {
  //   try {
  //     const response = await axios.delete(`/deleteTransaction/${transactionId}`, {
  //       params: { user_id },
  //     });

  //     if (response.status === 200) {
  //       alert("Transaction deleted successfully!");
  //       fetchTransactions();
  //     } else {
  //       alert("Failed to delete transaction.");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting transaction:", error);
  //     alert("Error deleting transaction. Please try again.");
  //   }
  // };

  return (
    <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-6 gap-6 rounded-lg">
        <div className="col-span-1 relative">
        <label className="block text-violet-500 text-center">Search</label>
          <input
            type="text"
            placeholder="Search by username, email, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUserSearch()}
            className="w-full p-2 pr-10 rounded-lg border border-violet-500 bg-white dark:bg-slate-700"
          />
          {searchTerm && (
            <MdCancel
              className="absolute right-3 top-9 text-violet-500 hover:text-red-500 cursor-pointer"
              size={18}
              onClick={() => setSearchTerm("")}
              title="Clear Search"
            />
          )}
        </div>
        <div className="col-span-1">
          <label className="block text-violet-500 text-center">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg bg-white dark:bg-slate-700 border border-violet-500"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-violet-500 text-center">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg bg-white dark:bg-slate-700 border border-violet-500"
          />
        </div>

        <div className="relative col-span-1">
          <label className="block text-violet-500 text-center">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg appearance-none bg-white dark:bg-slate-700 border border-violet-500"
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

        <div className="relative col-span-1">
          <label className="block text-violet-500 text-center">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg appearance-none bg-white dark:bg-slate-700 border border-violet-500"
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

        <div className="flex justify-center mt-6 mb-6">
          <button
            onClick={generateReport}
            className="w-full p-2 rounded-lg bg-violet-700 text-violet-100"
          >
            Generate Report
          </button>
        </div>
      </div>

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
                {/* <div className="flex space-x-3">
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
                </div> */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
