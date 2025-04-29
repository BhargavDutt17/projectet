import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import CustomLoader from "../Custom/CustomLoader";
import { showToast } from "../Custom/ToastUtil";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const UserChart = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem("role");
  if (userRole !== "admin") {
    return <p className="text-center text-red-500">You are not authorized to view this chart.</p>;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/users/");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users data:", err);
        showToast("Error fetching users data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const chartData = useMemo(() => {
    if (!users) return {};

    const statusCounts = {
      active: 0,
      inactive: 0,
      pending_deactivation: 0,
      pending_deletion: 0,
    };

    users.forEach((user) => {
      const status = user.status;
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });

    const labels = ["Active", "Inactive", "Pending Deactivation", "Pending Deletion"];
    const values = [
      statusCounts.active,
      statusCounts.inactive,
      statusCounts.pending_deactivation,
      statusCounts.pending_deletion,
    ];

    const backgroundColor = [
      "#7c3aed", // violet-600 (active)
      "#9333ea", // purple-600 (inactive)
      "#6366f1", // indigo-500 (pending deactivation)
      "#d946ef", // fuchsia-500 (pending deletion)
    ];
    const borderColor = [
      "#ddd6fe", // violet-200
      "#e9d5ff", // purple-200
      "#a5b4fc", // indigo-200
      "#f5d0fe", // fuchsia-200
    ];

    return {
      labels,
      datasets: [
        {
          label: "Users",
          data: values,
          backgroundColor,
          borderColor,
          borderWidth: 1.5,
          borderRadius: 12,
        },
      ],
    };
  }, [users]);

  const chartOptions = {
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: "easeOutBounce",
    },
    plugins: {
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#7c3aed",
        bodyColor: "#e5e7eb",
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen p-4">
      <div className="my-8 p-6 rounded-lg shadow-xl w-full max-w-7xl mx-auto bg-white dark:bg-gray-950">
        <h1 className="text-3xl text-center font-bold text-violet-600 dark:text-violet-400 mb-12">
          User Status Charts
        </h1>

        {loading ? (
          <CustomLoader />
        ) : (
          <>
            {/* Top Row: Doughnut & Pie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center mb-16">
              <div className="flex flex-col items-center w-full">
                <h2 className="text-xl font-semibold text-violet-500 mb-4">Doughnut Chart</h2>
                <div className="h-[400px] w-full md:w-[400px]">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              </div>

              <div className="flex flex-col items-center w-full">
                <h2 className="text-xl font-semibold text-purple-500 mb-4">Pie Chart</h2>
                <div className="h-[400px] w-full md:w-[400px]">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Bottom: Violet Themed Bar Chart */}
            <div className="flex flex-col items-center w-full mt-6">
              <h2 className="text-2xl font-semibold text-indigo-500 mb-6">Bar Chart</h2>
              <div className="h-[500px] w-full md:w-[90%] lg:w-[80%]">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                      duration: 1500,
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
                    },
                    plugins: {
                      tooltip: {
                        backgroundColor: "#1f2937",
                        titleColor: "#7c3aed",
                        bodyColor: "#e5e7eb",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserChart;
