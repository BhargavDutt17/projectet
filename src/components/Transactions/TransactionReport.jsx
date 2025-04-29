import React, { useState, useEffect, useCallback, useTransition } from "react";
import axios from "axios";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

export const TransactionReport = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    generatedDate: "",
  });
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const user_id = localStorage.getItem("id");
      if (!user_id) {
        showToast("User ID not found", "error");
        return;
      }

      try {
        const response = await axios.get(`/getAllTransactionReports/${user_id}`);
        setReports(response.data.reports);
      } catch (error) {
        console.error("Error fetching transaction reports:", error);
        showToast("Error fetching transaction reports", "error");
      } finally {
        setLoading(false);
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

  const toggleReportSelection = (reportId) => {
    setSelectedReports((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };

  const handleDeleteSelectedReports = async () => {
    if (selectedReports.length === 0) return;
    setLoading(true);
    try {
      await axios.post("/transaction-reports/delete-selected", {
        report_id: selectedReports,
      });

      startTransition(() => {
        setReports((prev) => prev.filter((r) => !selectedReports.includes(r._id)));
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

  const handleDeleteReport = useCallback(async (reportId) => {
    try {
      await axios.delete(`/transaction-reports/${reportId}`);
      startTransition(() => {
        setReports((prevReports) => prevReports.filter((r) => r._id !== reportId));
      });
      showToast("Report deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting report:", error);
      showToast("Failed to delete report", "error");
    }
  }, []);

  const handleDeleteAllReports = async () => {
    setLoading(true);
    const user_id = localStorage.getItem("id");
    if (!user_id) {
      showToast("User ID not found", "error");
      return;
    }

    try {
      await axios.delete(`/all-transaction-reports/${user_id}`);
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

  return (
    <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
      {loading && <CustomLoader />}

      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filter Inputs */}
        {["startDate", "endDate", "generatedDate"].map((key) => (
          <div key={key} className="col-span-1">
            <label className="block text-violet-500 text-center">
              {key === "startDate" ? "Start Date" : key === "endDate" ? "End Date" : "Generated Date"}
            </label>
            <input
              type="date"
              name={key}
              value={filters[key] ? filters[key].split("/").reverse().join("-") : ""}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 
                bg-white dark:bg-slate-700 border border-violet-500"
            />
          </div>
        ))}
      </div>

      <div className="my-4 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-950">
        <div className="mt-6 bg-white dark:bg-gray-950 p-4 rounded-lg shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-violet-500">Transaction Reports</h3>
            {selectedReports.length > 0 ? (
              <button
                onClick={handleDeleteSelectedReports}
                className="bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 hover:to-rose-900 text-red-200 
                  flex items-center gap-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 px-3 py-1 rounded-lg shadow"
              >
                <FaTrashAlt />
                Delete Selected
              </button>
            ) : (
              <button
                onClick={handleDeleteAllReports}
                className="bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 hover:to-rose-900 text-red-200 
                  flex items-center gap-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 px-3 py-1 rounded-lg shadow"
              >
                <FaTrashAlt />
                Delete All
              </button>
            )}
          </div>

          <ul className="list-disc pl-5 space-y-2">
            {filteredReports.map((report) => (
              <li
                key={report._id}
                className="bg-white dark:bg-slate-700 p-3 rounded-md shadow border border-violet-500 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-gray-950 dark:text-white">{report.report_name}</span>
                  <span className="ml-2 text-gray-950 dark:text-white">
                    ({report.start_date} - {report.end_date})
                  </span>
                  <span className="ml-2 text-sm text-gray-950 dark:text-white">
                    Generated At: {report.generated_at}
                  </span>
                </div>
                <div className="flex space-x-3 items-center">
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
                    onChange={() => toggleReportSelection(report._id)}
                    className="accent-violet-600 w-4 h-4"
                  />
                </div>
              </li>
            ))}
            {filteredReports.length === 0 && (
              <p className="text-center text-gray-500 dark:text-white">No reports found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
