import React, { useState, useEffect, useCallback, useTransition } from "react";
import axios from "axios";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserReport = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    generatedDate: "",
    generatedTime: "",
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/user-reports");
        setReports(response.data.reports);
      } catch (error) {
        console.error("Error fetching user reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "generatedDate") {
      if (value) {
        const [year, month, day] = value.split("-");
        setFilters((prev) => ({ ...prev, [name]: `${day}/${month}/${year}` }));
      } else {
        setFilters((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
  };

  const filteredReports = reports.filter((report) => {
    const [datePart, timePart] = (report.generated_at || "").split(" ");
    const reportDate = parseDate(datePart);
    const reportTimeParts = timePart?.split(":").map(Number);
    const reportHours = reportTimeParts?.[0];
    const reportMinutes = reportTimeParts?.[1];

    const filterDate = filters.generatedDate ? parseDate(filters.generatedDate) : null;
    const filterTime = filters.generatedTime ? parseTime(filters.generatedTime) : null;

    const matchDate =
      !filterDate || (reportDate && reportDate.toDateString() === filterDate.toDateString());

    const matchTime =
      !filterTime ||
      (reportHours === filterTime.hours && reportMinutes === filterTime.minutes);

    return matchDate && matchTime;
  });

  const handleDeleteReport = useCallback(async (reportId) => {
    try {
      await axios.delete(`/user-reports/${reportId}`);
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

  const handleDeleteAllReports = async () => {
    try {
      await axios.delete("/user-reports");
      startTransition(() => {
        setReports([]);
      });
      toast.success("All reports deleted successfully", {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error deleting all reports:", error);
      toast.error("Failed to delete all reports", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <label className="block text-violet-500 text-center">Generated Date</label>
          <input
            type="date"
            name="generatedDate"
            value={filters.generatedDate ? filters.generatedDate.split("/").reverse().join("-") : ""}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 bg-white dark:bg-slate-700 border border-violet-500"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-violet-500 text-center">Generated Time</label>
          <input
            type="time"
            name="generatedTime"
            value={filters.generatedTime}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 bg-white dark:bg-slate-700 border border-violet-500"
          />
        </div>
      </div>

      <div className="my-4 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-950">
        <div className="mt-6 bg-white dark:bg-gray-950 p-4 rounded-lg shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-violet-500">User Reports</h3>
            <button
              onClick={handleDeleteAllReports}
              className="bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 
              hover:to-rose-900 text-red-200 flex items-center gap-1 text-sm ocus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-red-600 px-3 py-1 rounded-lg shadow"
            >
              <FaTrashAlt />
              Delete All
            </button>
          </div>
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
              <p className="text-center text-gray-500 dark:text-white">No reports found</p>
            )}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
