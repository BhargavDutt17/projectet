import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import { showToast } from "../Custom/ToastUtil";
import CustomLoader from "../Custom/CustomLoader";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const TransactionChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedYear, setSelectedYear] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          const msg = "User not found. Please sign in.";
          setError(msg);
          showToast(msg, "error");
          return;
        }

        const { data } = await axios.get(`/getTransactionByUserId/${userId}`, {
          params: { year: selectedYear !== "all" ? selectedYear : undefined },
        });

        setTransactions(data || []);
        setError(null);
      } catch (err) {
        const msg = err?.response?.data?.message || "Error fetching transactions";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedYear]);

  useEffect(() => {
    setFilteredTransactions(
      transactions.filter(({ date }) =>
        (selectedYear === "all" || date.startsWith(selectedYear)) &&
        (!startDate || new Date(date) >= new Date(startDate)) &&
        (!endDate || new Date(date) <= new Date(endDate))
      )
    );
  }, [transactions, selectedYear, startDate, endDate]);

  const {
    income,
    expense,
    categoryTotals,
    incomeBySub,
    expenseBySub,
  } = useMemo(() => {
    const result = {
      income: 0,
      expense: 0,
      categoryTotals: {},
      incomeBySub: {},
      expenseBySub: {},
    };

    filteredTransactions.forEach(({ amount, category_id, subcategory_id }) => {
      const value = parseFloat(amount) || 0;
      const category = category_id?.name?.toLowerCase();
      const sub = subcategory_id?.name || "Unknown";

      if (category === "income") {
        result.income += value;
        result.incomeBySub[sub] = (result.incomeBySub[sub] || 0) + value;
      } else if (category === "expense") {
        result.expense += value;
        result.expenseBySub[sub] = (result.expenseBySub[sub] || 0) + value;
      }

      result.categoryTotals[sub] = (result.categoryTotals[sub] || 0) + value;
    });

    return result;
  }, [filteredTransactions]);

  const colorPalette = [
    "#7c3aed", "#8b5cf6", "#6d28d9", "#5b21b6", "#7e22ce",
    "#9333ea", "#a855f7", "#a21caf", "#c084fc", "#c026d3",
    "#d946ef", "#e879f9", "#e11d48", "#f43f5e", "#f59e0b",
    "#eab308", "#10b981", "#22c55e", "#0ea5e9", "#6366f1",
  ];
  const borderColorPalette = colorPalette.map(() => "#d1d5db");

  const chartData = (labels, data, bgColor, borderColor) => ({
    labels,
    datasets: [{
      data,
      backgroundColor: Array.isArray(bgColor) ? bgColor : Array(labels.length).fill(bgColor),
      borderColor: Array.isArray(borderColor) ? borderColor : Array(labels.length).fill(borderColor),
      borderWidth: 1,
      borderRadius: 10,
      barPercentage: 0.6,
      categoryPercentage: 0.6,
    }],
  });

  const combinedIncomeExpenseData = useMemo(() => {
    const allSubcategories = Array.from(new Set([...Object.keys(incomeBySub), ...Object.keys(expenseBySub)]));
    return {
      labels: allSubcategories,
      datasets: [
        {
          label: "Income",
          data: allSubcategories.map(sub => incomeBySub[sub] || 0),
          backgroundColor: "#7c3aed",
          borderColor: "#7c3aed", // Updated to violet-400
          borderWidth: 2,
          borderRadius: 10,
        },
        {
          label: "Expense",
          data: allSubcategories.map(sub => expenseBySub[sub] || 0),
          backgroundColor: "#a855f7",
          borderColor: "#a855f7", // Updated to violet-400
          borderWidth: 2,
          borderRadius: 10,
        },
      ],
    };
  }, [incomeBySub, expenseBySub]);

  const tabs = [
    {
      title: "Income vs Expense",
      content: (
        <Doughnut
          data={chartData(["Income", "Expense"], [income, expense], ["#7c3aed", "#f43f5e"], ["#7c3aed", "#f43f5e"])}
          options={{
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
              tooltip: {
                backgroundColor: "#1f2937",
                titleColor: "#f9fafb",
                bodyColor: "#e5e7eb",
              },
            },
          }}
        />
      ),
    },
    {
      title: "Transactions by Category",
      content: (
        <Pie
          data={chartData(Object.keys(categoryTotals), Object.values(categoryTotals), colorPalette, borderColorPalette)}
          options={{
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                backgroundColor: "#1f2937",
                titleColor: "#f9fafb",
                bodyColor: "#e5e7eb",

              },
            },
          }}
        />
      ),
    },
    {
      title: "Income by Category",
      content: (
        <Bar
          data={chartData(Object.keys(incomeBySub), Object.values(incomeBySub), "#7c3aed", "#7c3aed")} // Updated to violet-400
          options={{
            maintainAspectRatio: false,
            animation: { duration: 1000 },
            scales: {
              x: {
                ticks: {
                  color: '#7c3aed',
                },
                grid: {
                  color: '#c4b5fd',
                },
              },
              y: {
                ticks: {
                  color: '#7c3aed',
                },
                grid: {
                  color: '#c4b5fd',
                },
              },
            }

          }}
        />
      ),
    },
    {
      title: "Expense by Category",
      content: (
        <Bar
          data={chartData(Object.keys(expenseBySub), Object.values(expenseBySub), "#a855f7", "#a855f7")} // Updated to violet-400
          options={{
            maintainAspectRatio: false,
            animation: { duration: 1000 },
            scales: {
              x: {
                ticks: {
                  color: '#7c3aed',
                },
                grid: {
                  color: '#c4b5fd',
                },
              },
              y: {
                ticks: {
                  color: '#7c3aed',
                },
                grid: {
                  color: '#c4b5fd',
                },
              },
            }
          }}
        />
      ),
    },
    {
      title: "Income vs Expense by Category",
      content: (
        <Bar
          data={combinedIncomeExpenseData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            animation: { duration: 1200, easing: "easeInOutQuart" },
            plugins: {
              tooltip: {
                backgroundColor: "#1f2937",
                titleColor: "#f9fafb",
                bodyColor: "#e5e7eb",
              },
              legend: {
                labels: { color: "#7c3aed" }, // Updated to violet-400
              },
            },
            scales: {
              x: {
                ticks: {
                  color: '#7c3aed',
                },
                grid: {
                  color: '#c4b5fd',
                },
              },
              y: {
                ticks: {
                  color: '#7c3aed',
                },
                grid: {
                  color: '#c4b5fd',
                },
              },
            }
          }}
        />
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen p-4 flex justify-center">
      <div className="my-8 p-6 bg-white dark:bg-gray-950 rounded-lg shadow-xl w-full max-w-5xl">
        <h1 className="text-2xl text-violet-500 font-bold text-center mb-6">Transaction Overview</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring focus:ring-violet-500 bg-white dark:bg-slate-800 text-violet-500"
          >
            {["all", ...new Set(transactions.map(t => t.date.split("-")[0]))].map(year => (
              <option key={year} value={year}>
                {year === "all" ? "All Years" : year}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded-lg border border-violet-300 bg-white dark:bg-slate-800 text-violet-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded-lg border border-violet-300 bg-white dark:bg-slate-800 text-violet-500"
          />
        </div>

        {loading ? (
          <CustomLoader />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-violet-500">No transactions found for this period.</p>
        ) : (
          <>
            <div className="flex justify-center mb-4 border-b border-gray-300 dark:border-gray-700 flex-wrap">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`py-2 px-4 text-sm font-medium transition ${activeTab === i
                      ? "text-violet-500 border-b-2 border-violet-500"
                      : "text-gray-500 hover:text-violet-500"
                    }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-center mb-4 text-violet-500">{tabs[activeTab].title}</h2>
              <div className="w-full h-[350px] md:w-[500px]">{tabs[activeTab].content}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionChart;
