import React, { useState, useEffect, useCallback, useTransition } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify

export const TransactionReport = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    generatedDate: "",
  });
  const [isPending, startTransition] = useTransition();

  // Fetch transaction reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      const user_id = localStorage.getItem("id");
      if (!user_id) return;

      try {
        const response = await axios.get(`/getAllTransactionReports/${user_id}`);
        setReports(response.data.reports);
        console.log("Fetching reports for user:", user_id);
      } catch (error) {
        console.error("Error fetching transaction reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      const [year, month, day] = value.split("-");
      setFilters((prev) => ({ ...prev, [name]: `${day}/${month}/${year}` }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredReports = reports.filter((report) => {
    const reportStartDate = parseDate(report.start_date);
    const reportEndDate = parseDate(report.end_date);
    const reportGeneratedDate = parseDate(report.generated_at?.split(" ")[0] || "");

    const filterStartDate = filters.startDate ? parseDate(filters.startDate) : null;
    const filterEndDate = filters.endDate ? parseDate(filters.endDate) : null;
    const filterGeneratedDate = filters.generatedDate ? parseDate(filters.generatedDate) : null;

    const startDateCheck = !filterStartDate || (reportStartDate && reportStartDate >= filterStartDate);
    const endDateCheck = !filterEndDate || (reportEndDate && reportEndDate <= filterEndDate);
    const generatedDateCheck = !filterGeneratedDate || 
      (reportGeneratedDate && reportGeneratedDate.toDateString() === filterGeneratedDate.toDateString());
    const generatedInRange = (!filterStartDate || !filterEndDate) || 
      (reportGeneratedDate >= filterStartDate && reportGeneratedDate <= filterEndDate);

    return startDateCheck && endDateCheck && generatedDateCheck && generatedInRange;
  });

  const handleDeleteReport = useCallback(async (reportId) => {
    try {
      await axios.delete(`/transaction-reports/${reportId}`); // No user_id, No role check

      startTransition(() => {
        setReports((prevReports) => prevReports.filter((r) => r._id !== reportId));
      });

      toast.success("Report deleted successfully", {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report", {
        position: "top-right",
        autoClose: 5000,
      });
    }
}, []);


  
  return (
    <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <label className="block text-violet-500 text-center">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate ? filters.startDate.split("/").reverse().join("-") : ""}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
      bg-white dark:bg-slate-700 border border-violet-500"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-violet-500 text-center">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate ? filters.endDate.split("/").reverse().join("-") : ""}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
      bg-white dark:bg-slate-700 border border-violet-500"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-violet-500 text-center">Generated Date</label>
          <input
            type="date"
            name="generatedDate"
            value={filters.generatedDate ? filters.generatedDate.split("/").reverse().join("-") : ""}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
      bg-white dark:bg-slate-700 border border-violet-500"
          />
        </div>
      </div>

      <div className="my-4 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-950">
        <div className="mt-6 bg-white dark:bg-gray-950 p-4 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-violet-500">
            Transaction Reports
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {filteredReports.map((report) => (
              <li
                key={report._id}
                className="bg-white dark:bg-slate-700 p-3 rounded-md shadow border border-violet-500 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-gray-950 dark:text-white">
                    {report.report_name}
                  </span>
                  <span className="ml-2 text-gray-950 dark:text-white">
                    ({report.start_date} - {report.end_date})
                  </span>
                  <span className="ml-2 text-sm text-gray-950 dark:text-white">
                    Generated At: {report.generated_at}
                  </span>
                </div>
                <div className="flex space-x-3">
                  {report.report_file_url ? (
                    <a
                      href={report.report_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-500 hover:text-violet-700 text-lg"
                    >
                      <IoMdDownload />
                    </a>
                  ) : (
                    <span className="text-gray-400">No File</span>
                  )}
                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
            {filteredReports.length === 0 && (
              <p className="text-center text-gray-500 dark:text-white">
                No reports found
              </p>
            )}
          </ul>
        </div>
      </div>
    <ToastContainer /> {/* Add the ToastContainer for notifications */}

    </div>
  );
};
