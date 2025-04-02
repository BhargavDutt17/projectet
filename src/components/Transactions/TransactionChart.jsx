import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          setError("User not found. Please sign in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/getTransactionByUserId/${userId}`, {
          params: {
            year: selectedYear !== "all" ? selectedYear : undefined,
          },
        });

        setTransactions(response.data || []);
      } catch (err) {
        setError("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedYear]);

  useEffect(() => {
    let filtered = transactions;

    if (selectedYear !== "all") {
      filtered = filtered.filter((transaction) => {
        const [year] = transaction.date.split("-");
        return year === selectedYear;
      });
    }

    if (startDate) {
      filtered = filtered.filter((transaction) => new Date(transaction.date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((transaction) => new Date(transaction.date) <= new Date(endDate));
    }

    setFilteredTransactions(filtered);
  }, [transactions, selectedYear, startDate, endDate]);

  const { income, expense } = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const transactionType = transaction?.category_id?.name?.toLowerCase();
        if (transactionType === "income") acc.income += parseFloat(transaction.amount) || 0;
        else if (transactionType === "expense") acc.expense += parseFloat(transaction.amount) || 0;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const categoryTotals = {};
    filteredTransactions.forEach((transaction) => {
      const subcategory = transaction?.subcategory_id?.name || "Unknown";
      categoryTotals[subcategory] = (categoryTotals[subcategory] || 0) + (parseFloat(transaction.amount) || 0);
    });

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Transactions by Category",
          data: Object.values(categoryTotals),
          backgroundColor: ["#f87171", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#e879f9"],
          borderColor: ["#f87171", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#e879f9"],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  }, [filteredTransactions]);

  const doughnutData = useMemo(
    () => ({
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Transactions",
          data: [income, expense],
          backgroundColor: ["#9f33ff", "#e50505"],
          borderColor: ["#9f33ff", "#e50505"],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    }),
    [income, expense]
  );

  const incomeVsSubcategoryData = useMemo(() => {
    const incomeBySubcategory = {};
    filteredTransactions.forEach((transaction) => {
      if (transaction?.category_id?.name?.toLowerCase() === "income") {
        const subcategory = transaction?.subcategory_id?.name || "Unknown";
        incomeBySubcategory[subcategory] = (incomeBySubcategory[subcategory] || 0) + (parseFloat(transaction.amount) || 0);
      }
    });

    return {
      labels: Object.keys(incomeBySubcategory),
      datasets: [
        {
          label: "Income by Subcategory",
          data: Object.values(incomeBySubcategory),
          backgroundColor: "#4ade80",
          borderColor: "#22c55e",
          borderWidth: 1,
        },
      ],
    };
  }, [filteredTransactions]);

  // Expense by Subcategory Vertical Bar Chart Data
  const expenseVsSubcategoryData = useMemo(() => {
    const expenseBySubcategory = {};
    filteredTransactions.forEach((transaction) => {
      if (transaction?.category_id?.name?.toLowerCase() === "expense") {
        const subcategory = transaction?.subcategory_id?.name || "Unknown";
        expenseBySubcategory[subcategory] = (expenseBySubcategory[subcategory] || 0) + (parseFloat(transaction.amount) || 0);
      }
    });

    return {
      labels: Object.keys(expenseBySubcategory),
      datasets: [
        {
          label: "Expense by Subcategory",
          data: Object.values(expenseBySubcategory),
          backgroundColor: "#e50505",
          borderColor: "#991b1b",
          borderWidth: 1,
        },
      ],
    };
  }, [filteredTransactions]);

  // Combined Income and Expense by Subcategory Vertical Bar Chart Data
  const combinedIncomeExpenseData = useMemo(() => {
    const combinedData = {};
    filteredTransactions.forEach((transaction) => {
      const subcategory = transaction?.subcategory_id?.name || "Unknown";
      const amount = parseFloat(transaction.amount) || 0;
      const category = transaction?.category_id?.name?.toLowerCase();

      if (!combinedData[subcategory]) {
        combinedData[subcategory] = { income: 0, expense: 0 };
      }

      if (category === "income") {
        combinedData[subcategory].income += amount;
      } else if (category === "expense") {
        combinedData[subcategory].expense += amount;
      }
    });

    return {
      labels: Object.keys(combinedData),
      datasets: [
        {
          label: "Income by Subcategory",
          data: Object.values(combinedData).map((item) => item.income),
          backgroundColor: "#4ade80",
          borderColor: "#22c55e",
          borderWidth: 1,
        },
        {
          label: "Expense by Subcategory",
          data: Object.values(combinedData).map((item) => item.expense),
          backgroundColor: "#e50505",
          borderColor: "#991b1b",
          borderWidth: 1,
        },
      ],
    };
  }, [filteredTransactions]);

  const tabs = [
    { title: "Income vs Expense", content: <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: "70%" }} /> },
    { title: "Transactions by Category", content: <Pie data={categoryData} options={{ maintainAspectRatio: false }} /> },
    { title: "Income vs Subcategory", content: <Bar data={incomeVsSubcategoryData} options={{ maintainAspectRatio: false }} /> },
    { title: "Expense by Subcategory", content: <Bar data={expenseVsSubcategoryData} options={{ maintainAspectRatio: false }} /> },
    { title: "Combined Income & Expense by Subcategory", content: <Bar data={combinedIncomeExpenseData} options={{ maintainAspectRatio: false }} /> },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const transactionYears = new Set(transactions.map((t) => t.date.split("-")[0]));

    const minYear = transactions.length > 0 ? Math.min(...Array.from(transactionYears).map(Number)) : currentYear;

    const allPossibleYears = [];
    for (let year = minYear; year <= currentYear; year++) {
      if (transactionYears.has(year.toString())) {
        allPossibleYears.push(year.toString());
      }
    }

    return ["all", ...allPossibleYears];
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen p-4 flex justify-center">
      <div className="my-8 p-6 bg-white dark:bg-gray-950 rounded-lg shadow-xl w-full max-w">
        <h1 className="text-2xl text-violet-500 font-bold text-center mb-6">Transaction Overview</h1>

        <div className="flex justify-center gap-4 mb-6">
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 border rounded bg-gray-100">
            {years.map((year) => (
              <option key={year} value={year}>
                {year === "all" ? "All Years" : year}
              </option>
            ))}
          </select>

          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded bg-gray-100" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded bg-gray-100" />
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found for this period.</p>
        ) : (
          <>
            <div className="flex justify-center mb-4 border-b border-gray-300 dark:border-gray-700">
              {tabs.map((tab, index) => (
                <button key={index} onClick={() => setActiveTab(index)} className={`py-2 px-4 text-sm font-medium transition ${activeTab === index ? "text-violet-500 border-b-2 border-violet-500" : "text-gray-500 hover:text-violet-500"}`}>
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-center mb-4">{tabs[activeTab].title}</h2>
              <div style={{ height: "350px", width: "350px" }}>{tabs[activeTab].content}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionChart;
