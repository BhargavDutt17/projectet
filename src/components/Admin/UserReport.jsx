import React, { useState, useEffect, useCallback, useTransition } from "react";
import axios from "axios";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { showToast } from "../Custom/ToastUtil";
import CustomLoader from "../Custom/CustomLoader";

export const UserReport = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    generatedDate: "",
    generatedTime: "",
  });
  const [selectedReports, setSelectedReports] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/user-reports");
        setReports(response.data.reports);
      } catch (error) {
        console.error("Error fetching user reports:", error);
        showToast("Error fetching user reports", "error");
      } finally {
        setLoading(false);
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
    setLoading(true);
    try {
      await axios.delete(`/user-reports/${reportId}`);
      startTransition(() => {
        setReports((prevReports) => prevReports.filter((r) => r._id !== reportId));
      });
      showToast("Report deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting report:", error);
      showToast("Failed to delete report", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteSelectedReports = async () => {
    if (selectedReports.length === 0) return;
    setLoading(true);
    try {
      await axios.post("/user-reports/delete-selected", {
        report_id: selectedReports,
      });
  
      startTransition(() => {
        setReports((prevReports) =>
          prevReports.filter((report) => !selectedReports.includes(report._id))
        );
        setSelectedReports([]);
      });
  
      showToast("Selected reports deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting selected reports:", error);
      showToast("Failed to delete selected reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllReports = async () => {
    setLoading(true);
    try {
      await axios.delete("/user-reports");
      startTransition(() => {
        setReports([]);
      });
      showToast("All reports deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting all reports:", error);
      showToast("Failed to delete all reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxToggle = (reportId) => {
    setSelectedReports((prevSelected) =>
      prevSelected.includes(reportId)
        ? prevSelected.filter((id) => id !== reportId)
        : [...prevSelected, reportId]
    );
  };

  return (
    <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
      {loading && <CustomLoader />}

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
              onClick={selectedReports.length > 0 ? handleDeleteSelectedReports : handleDeleteAllReports}
              disabled={selectedReports.length === 0 && reports.length === 0}
              className="bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 
              hover:to-rose-900 text-red-200 flex items-center gap-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-red-600 px-3 py-1 rounded-lg shadow disabled:opacity-50"
            >
              <FaTrashAlt />
              {selectedReports.length > 0 ? "Delete Selected" : "Delete All"}
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            {filteredReports.map((report) => (
              <li
                key={report._id}
                className="bg-white dark:bg-slate-700 p-3 rounded-md shadow border border-violet-500 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <span className="font-medium text-gray-950 dark:text-white">
                      {report.report_name}
                    </span>
                    <span className="ml-2 text-sm text-gray-950 dark:text-white">
                      Generated At: {report.generated_at}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report._id)}
                    onChange={() => handleCheckboxToggle(report._id)}
                    className="mr-3 accent-violet-600 w-4 h-4"
                  />
                </div>
              </li>
            ))}
            {filteredReports.length === 0 && (
              <p className="text-center text-violet-400">No reports found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserReport;
