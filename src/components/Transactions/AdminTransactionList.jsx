import React ,{ useState } from 'react'
import { FaTrash, FaEdit } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const mockCategories = [
  { _id: "1", name: "Food" },
  { _id: "2", name: "Transport" },
  { _id: "3", name: "Utilities" },
  { _id: "4", name: "Salary" },
];

const mockTransactions = [
  {
    _id: "1",
    date: "2025-2-17",
    type: "expense",
    category: { name: "Food" },
    amount: 4000,
    description: "Birthday celebration at Restaurants",
  },
  {
    _id: "2",
    date: "2025-2-10",
    type: "income",
    category: { name: "Salary" },
    amount: 15000,
    description: "Monthly Salary",
  },
  {
    _id: "3",
    date: "2025-2-15",
    type: "expense",
    category: { name: "Transport" },
    amount: 200,
    description: "Patrol",
  },
  {
    _id: "4",
    date: "2025-2-15",
    type: "income",
    category: { name: "GTPL" },
    amount: 30000,
    description: "Monthly Income",
  },
  {
    _id: "5",
    date: "2025-1-14",
    type: "expense",
    category: { name: "Food" },
    amount: 7000,
    description: "Family Dinner at Restaurants",
  },
  {
    _id: "6",
    date: "2025-1-10",
    type: "income",
    category: { name: "Salary" },
    amount: 15000,
    description: "Monthly Salary",
  },
  {
    _id: "7",
    date: "2025-1-15",
    type: "expense",
    category: { name: "Transport" },
    amount: 200,
    description: "Patrol",
  },
  {
    _id: "8",
    date: "2025-1-15",
    type: "income",
    category: { name: "GTPL" },
    amount: 30000,
    description: "Monthly Income",
  },
];

export const AdminTransactionList = () => {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        type: "",
        category: "",
      });
    
      const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
      };
    
      const filteredTransactions = mockTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const isWithinDateRange =
          (!filters.startDate || transactionDate >= new Date(filters.startDate)) &&
          (!filters.endDate || transactionDate <= new Date(filters.endDate));
        const isTypeMatch = !filters.type || transaction.type === filters.type;
        const isCategoryMatch = !filters.category || transaction.category.name === filters.category;
    
        return isWithinDateRange && isTypeMatch && isCategoryMatch;
      });
    
      // Function to format date to dd/mm/yyyy
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
    
      return (
        <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
          <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 ">
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
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/5 text-violet-500" />
            </div>
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
            {mockCategories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/5 text-violet-500" />
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
                        {formatDate(transaction.date)} {/* Use the formatDate function */}
                      </span>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </span>
                      <span className="ml-2 text-gray-950 dark:text-white">
                        {transaction.category.name} - ₹
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