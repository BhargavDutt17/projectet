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
        if (!userId) return setError("User not found. Please sign in."), setLoading(false);
        const { data } = await axios.get(`/getTransactionByUserId/${userId}`, {
          params: { year: selectedYear !== "all" ? selectedYear : undefined },
        });
        setTransactions(data || []);
      } catch {
        setError("Error fetching transactions");
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

  const { income, expense, categoryTotals, incomeBySub, expenseBySub } = useMemo(() => {
    const result = { income: 0, expense: 0, categoryTotals: {}, incomeBySub: {}, expenseBySub: {} };
    filteredTransactions.forEach(({ amount, category_id, subcategory_id }) => {
      const value = parseFloat(amount) || 0;
      const category = category_id?.name?.toLowerCase();
      const subcategory = subcategory_id?.name || "Unknown";

      if (category === "income") result.income += value, (result.incomeBySub[subcategory] = (result.incomeBySub[subcategory] || 0) + value);
      else if (category === "expense") result.expense += value, (result.expenseBySub[subcategory] = (result.expenseBySub[subcategory] || 0) + value);
      result.categoryTotals[subcategory] = (result.categoryTotals[subcategory] || 0) + value;
    });
    return result;
  }, [filteredTransactions]);

  const chartData = (labels, data, bgColor, borderColor) => ({
    labels,
    datasets: [{ data, backgroundColor: bgColor, borderColor, borderWidth: 1 }],
  });

  const combinedIncomeExpenseData = useMemo(() => ({
    labels: Object.keys({ ...incomeBySub, ...expenseBySub }),
    datasets: [
      { label: "Income", data: Object.values(incomeBySub), backgroundColor: "#4ade80", borderColor: "#22c55e" },
      { label: "Expense", data: Object.values(expenseBySub), backgroundColor: "#e50505", borderColor: "#991b1b" },
    ],
  }), [incomeBySub, expenseBySub]);

  const tabs = [
    { title: "Income vs Expense", content: <Doughnut data={chartData(["Income", "Expense"], [income, expense], ["#9f33ff", "#e50505"], ["#9f33ff", "#e50505"])} options={{ maintainAspectRatio: false, cutout: "70%" }} /> },
    { title: "Transactions by Category", content: <Pie data={chartData(Object.keys(categoryTotals), Object.values(categoryTotals), ["#f87171", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#e879f9"], ["#f87171", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#e879f9"])} options={{ maintainAspectRatio: false }} /> },
    { title: "Income vs Subcategory", content: <Bar data={chartData(Object.keys(incomeBySub), Object.values(incomeBySub), "#4ade80", "#22c55e")} options={{ maintainAspectRatio: false }} /> },
    { title: "Expense by Subcategory", content: <Bar data={chartData(Object.keys(expenseBySub), Object.values(expenseBySub), "#e50505", "#991b1b")} options={{ maintainAspectRatio: false }} /> },
    { title: "Combined Income & Expense", content: <Bar data={combinedIncomeExpenseData} options={{ maintainAspectRatio: false }} /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen p-4 flex justify-center">
      <div className="my-8 p-6 bg-white dark:bg-gray-950 rounded-lg shadow-xl w-full max-w">
        <h1 className="text-2xl text-violet-500 font-bold text-center mb-6">Transaction Overview</h1>

        <div className="flex justify-center gap-4 mb-6">
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} 
          className="p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
                bg-white dark:bg-slate-700 border border-violet-500 text-violet-500">
            {["all", ...new Set(transactions.map((t) => t.date.split("-")[0]))].map((year) => (
              <option key={year} value={year}>{year === "all" ? "All Years" : year}</option>
            ))}
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
          className="p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
                bg-white dark:bg-slate-700 border border-violet-500 text-violet-500" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
          className="p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
                bg-white dark:bg-slate-700 border border-violet-500 text-violet-500" />
        </div>

        {loading ? <p className="text-center">Loading...</p> : error ? 
        <p className="text-center text-red-500">{error}</p> : filteredTransactions.length === 0 ? 
        <p className="text-center text-violet-500">No transactions found for this period.</p> : (
          <>
            <div className="flex justify-center mb-4 border-b border-gray-300 dark:border-gray-700">
              {tabs.map((tab, index) => (
                <button key={index} onClick={() => setActiveTab(index)} 
                className={`py-2 px-4 text-sm font-medium transition ${activeTab === index ? "text-violet-500 border-b-2 border-violet-500" : "text-gray-500 hover:text-violet-500"}`}>
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-center mb-4 text-violet-500">{tabs[activeTab].title}</h2>
              <div style={{ height: "350px", width: "350px" }}>{tabs[activeTab].content}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionChart;
