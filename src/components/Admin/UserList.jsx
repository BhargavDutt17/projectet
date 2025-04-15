// Import section
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdToggleOff, MdToggleOn, MdCancel } from "react-icons/md";
import { RiFileList2Fill } from "react-icons/ri";
import { IoPersonCircleOutline } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toggle from "../Custom/Toggle";
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

export const UserList = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("user");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [showFullImage, setShowFullImage] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    const isAdmin = localStorage.getItem("role") === "admin";

    const fetchUsers = async () => {
        setLoading(true); // Start loading when form submission begins
        try {
            const res = await axios.get("/users/");
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            showToast("Error fetching users","error")
        }finally {
            setLoading(false); // Stop loading when the request completes
          }
    };

    const fetchRoles = async () => {
        try {
            const res = await axios.get("/roles/");
            setRoles(res.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleTransactionRedirect = (user_Id) => {
        localStorage.setItem("selected_user_id", user_Id);
        navigate("/admin/admintransactionlists", { state: { user_id: user_Id } });
    };



    const handleDeactivate = async (user_Id) => {
        try { setLoading(true); // Start loading when form submission begins
            await axios.put(`/user/deactivate/${user_Id}`, {
                role: "admin",
                password: "",
            });
            showToast("Deactivation scheduled");
            fetchUsers();
        } catch (error) {
            console.error("Error deactivating user:", error);
            showToast("Error deactivating user","error")
        }finally {
            setLoading(false); // Stop loading when the request completes
          }
    };

    const handleActivate = async (user_Id, email_or_username) => {
        try {
            setLoading(true); // Start loading when form submission begins
            const res = await axios.post("/users/activate", {
                email_or_username,
                password: "",
                role: "admin",
            });

            if (res.data.status) {
                showToast("Account activated");
                fetchUsers();
            } else {
                showToast(res.data.message);
            }
        } catch (err) {
            showToast("Failed to activate user");
            console.error(err);
        }finally {
            setLoading(false); // Stop loading when the request completes
          }
    };

    const handleDelete = async (user_Id) => {
        setLoading(true); // Start loading when form submission begins
        try {
            await axios.delete(`/user/delete/${user_Id}`, {
                data: { role: "admin", password: "" },
            });
            showToast("Deletion scheduled");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            showToast("Error deleting user","error")
        }finally {
            setLoading(false); // Stop loading when the request completes
          }
    };

    const handleCancelDelete = async (userId) => {
        try { setLoading(true); // Start loading when form submission begins
            await axios.put(`/user/cancel-delete/${userId}`);
            showToast("Deletion cancelled");
            fetchUsers();
        } catch (error) {
            console.error("Error canceling deletion:", error);
            showToast("Error canceling deletion","error")
        }
    };

    const filteredAndSortedUsers = users
        .filter((user) => {
            const search = searchTerm.toLowerCase();
            const matchesSearch = (() => {
                if (!search) return true;

                switch (sortBy) {
                    case "username":
                        return user.username?.toLowerCase().includes(search);
                    case "firstName":
                        return user.firstName?.toLowerCase().includes(search);
                    case "lastName":
                        return user.lastName?.toLowerCase().includes(search);
                    case "email":
                        return user.email?.toLowerCase().includes(search);
                    default:
                        return (
                            user.username?.toLowerCase().includes(search) ||
                            user.email?.toLowerCase().includes(search) ||
                            user.firstName?.toLowerCase().includes(search) ||
                            user.lastName?.toLowerCase().includes(search)
                        );
                }
            })();

            const matchesRole =
                selectedRole === "all" || user.role?.name === selectedRole;

            const matchesStatus =
                selectedStatus === "all" || user.status === selectedStatus;

            return matchesSearch && matchesRole && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy) {
                const aValue = a[sortBy]?.toLowerCase() || "";
                const bValue = b[sortBy]?.toLowerCase() || "";
                return aValue.localeCompare(bValue);
            }
            return 0;
        });

    return (
        <div className="min-h-screen p-4 bg-white dark:bg-gray-950 text-violet-500 font-small">
            {loading&&<CustomLoader/>}
            {/* Filters + Admin Buttons */}
            <div className="mx-auto grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 items-end">
                <div className="col-span-1 relative">
                    <label className="block text-violet-500 text-center">Search</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full p-2 pr-10 rounded-lg border border-violet-500 bg-white dark:bg-slate-700"
                    />
                    {searchTerm && (
                        <MdCancel
                            className="absolute right-3 top-9 text-violet-500 hover:text-red-500 cursor-pointer"
                            size={18}
                            onClick={() => setSearchTerm("")}
                            title="Clear"
                        />
                    )}
                </div>


                <div className="col-span-1">
                    <label className="block text-violet-500 text-center">Role</label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full p-2 rounded-lg border border-violet-500 bg-white dark:bg-slate-700"
                    >
                        <option value="user">User (Default)</option>
                        {roles
                            .filter((role) => role.name !== "user")
                            .map((role) => (
                                <option key={role._id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        <option value="all">All Roles</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-violet-500 text-center">Status</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full p-2 rounded-lg border border-violet-500 bg-white dark:bg-slate-700"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending_deactivation">Pending Deactivation</option>
                        <option value="pending_deletion">Pending Deletion</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-violet-500 text-center">Search By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-2 rounded-lg border border-violet-500 bg-white dark:bg-slate-700"
                    >
                        <option value="">Search All Fields</option>
                        <option value="username">Username</option>
                        <option value="firstName">First Name</option>
                        <option value="lastName">Last Name</option>
                        <option value="email">Email</option>
                    </select>
                </div>

                {isAdmin && (
                    <div className="col-span-1">
                        <label className="block text-transparent select-none">.</label>
                        <button
                            onClick={async () => {
                                setLoading(true); // Start loading when form submission begins
                                try {
                                    await axios.post("/user-reports/generate", {
                                        selectedRole,
                                        selectedStatus,
                                        searchTerm,
                                    });
                                    showToast("Excel report generated successfully","success");
                                } catch (err) {
                                    console.error("Generate error:", err);
                                    showToast("Failed to generate report");
                                }finally {
                                    setLoading(false); // Stop loading when the request completes
                                  }
                            }}
                            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 
      focus:ring-opacity-50 bg-violet-700 text-violet-100"
                        >
                            Generate Report
                        </button>
                    </div>
                )}

                {isAdmin && (
                    <div className="col-span-1">
                        <label className="block text-transparent select-none">.</label>
                        <button
                            onClick={async () => {
                                setLoading(true); // Start loading when form submission begins
                                try {
                                    const res = await axios.get("/user-reports/latest");
                                    const url = res.data?.report_file_url;
                                    if (url) window.open(url, "_blank");
                                    else showToast("No latest report found");
                                } catch (err) {
                                    console.error("Download error:", err);
                                    showToast("Failed to download report");
                                }finally {
                                    setLoading(false); // Stop loading when the request completes
                                  }
                            }}
                            className="w-full p-2 rounded-lg border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-500 
      focus:ring-opacity-50 bg-violet-700 text-violet-100"
                        >
                            Download Report
                        </button>
                    </div>
                )}
            </div>


            {/* User Cards */}
            <div className="space-y-4">
                {filteredAndSortedUsers.map((user) => (
                    <div
                        key={user._id}
                        className="bg-white dark:bg-slate-700 p-4 rounded-md shadow border border-violet-500 flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            {user.profile_image ? (
                                <img
                                    src={user.profile_image}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover cursor-pointer border border-violet-500"
                                    onClick={() => setSelectedUser(user)}
                                />
                            ) : (
                                <IoPersonCircleOutline
                                    className="text-5xl text-violet-500 cursor-pointer"
                                    onClick={() => setSelectedUser(user)}
                                />
                            )}
                            <div>
                                <div className="font-semibold text-gray-950 dark:text-white">
                                    {user.firstName} {user.lastName} ({user.username})
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-4 text-xl items-center">
                            <RiFileList2Fill
                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                                onClick={() => handleTransactionRedirect(user._id)}
                            />

                            {user.status === "pending_deletion" ? (
                                <MdCancel
                                    className="text-xl text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => handleCancelDelete(user._id)}
                                    title="Cancel Deletion"
                                />
                            ) : (
                                <Toggle
                                    isChecked={user.status === "active"}
                                    onToggle={() =>
                                        user.status === "active"
                                            ? handleDeactivate(user._id)
                                            : handleActivate(user._id, user.username || user.email)
                                    }
                                    title={user.status === "active" ? "Click to Deactivate" : "Click to Activate"}
                                />
                            )}

                            <FaTrash
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(user._id)}
                                title="Delete User"
                            />
                        </div>

                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg relative">

                        {/* Full Image Mode */}
                        {showFullImage ? (
                            <div className="flex flex-col items-center">
                                <img
                                    src={selectedUser.profile_image}
                                    alt="Full Profile"
                                    className="w-full max-h-[70vh] object-contain rounded-lg border-4 border-violet-500"
                                />
                                <button
                                    onClick={() => setShowFullImage(false)}
                                    className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                                >
                                    Close Full Image
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Profile Image */}
                                <div className="flex justify-center mb-6">
                                    <div
                                        className="relative inline-block cursor-pointer group"
                                        onClick={() => selectedUser.profile_image && setShowFullImage(true)}
                                        title="Click to view full image"
                                    >
                                        {selectedUser.profile_image ? (
                                            <img
                                                src={selectedUser.profile_image}
                                                alt="Profile"
                                                className="w-36 h-36 rounded-full border-4 border-violet-500 object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <IoPersonCircleOutline className="text-[140px] text-violet-500" />
                                        )}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="text-gray-800 dark:text-white text-[15px] space-y-3 px-4">
                                    <p>
                                        <span className="font-semibold text-violet-600">First Name:</span>{" "}
                                        {selectedUser.firstName}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-violet-600">Last Name:</span>{" "}
                                        {selectedUser.lastName}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-violet-600">Username:</span>{" "}
                                        {selectedUser.username}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-violet-600">Email:</span>{" "}
                                        {selectedUser.email}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-violet-600">Status:</span>{" "}
                                        <span
                                            className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${selectedUser.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : selectedUser.status === "inactive"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : selectedUser.status === "pending_deletion"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {selectedUser.status}
                                        </span>
                                    </p>
                                </div>

                                {/* Close Modal Button */}
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow"
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};
