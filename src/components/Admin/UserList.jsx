import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdToggleOff, MdToggleOn, MdCancel } from "react-icons/md";
import { RiFileList2Fill } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("user"); // ✅ Default to 'user'
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users/");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
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
    navigate(`/user/transactionlist/${user_Id}`);
  };

  const handleDeactivate = async (user_Id) => {
    try {
      await axios.put(`/user/deactivate/${user_Id}`, {
        role: "admin",
        password: "",
      });
      alert("Deactivation scheduled");
      fetchUsers();
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleActivate = async (user_Id, email_or_username) => {
    try {
      const res = await axios.post("/users/activate", {
        email_or_username,
        password: "",
        role: "admin",
      });

      if (res.data.status) {
        alert("Account activated");
        fetchUsers();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Failed to activate user");
      console.error(err);
    }
  };

  const handleDelete = async (user_Id) => {
    try {
      await axios.delete(`/user/delete/${user_Id}`, {
        data: { role: "admin", password: "" },
      });
      alert("Deletion scheduled");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCancelDelete = async (userId) => {
    try {
      await axios.put(`/user/cancel-delete/${userId}`);
      alert("Deletion cancelled");
      fetchUsers();
    } catch (error) {
      console.error("Error canceling deletion:", error);
    }
  };

  const exportToCSV = () => {
    const csvRows = [
      ["Username", "Email", "Role", "Status"],
      ...filteredAndSortedUsers.map((u) => [
        u.username,
        u.email,
        u.role?.name || "N/A",
        u.status,
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "user_list.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="min-h-screen p-4 shadow-lg bg-white dark:bg-gray-950 text-violet-500 font-small">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by username, email, first or last name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-lg border border-violet-500 bg-white dark:bg-slate-700"
        />

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

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportToCSV}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-violet-700"
        >
          Export to CSV
        </button>
      </div>

      {/* User Cards */}
      <div className="space-y-4">
        {filteredAndSortedUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white dark:bg-slate-700 p-4 rounded-md shadow border border-violet-500 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.profile_image || "https://via.placeholder.com/50"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover cursor-pointer border border-violet-500"
                onClick={() => setSelectedUser(user)}
              />
              <div>
                <div className="font-semibold text-gray-950 dark:text-white">
                  {user.firstName} {user.lastName} ({user.username})
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="flex space-x-4 text-xl">
              <RiFileList2Fill
                className="cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => handleTransactionRedirect(user._id)}
              />
              {user.status === "active" ? (
                <MdToggleOn
                  className="cursor-pointer text-green-500 hover:text-green-700"
                  onClick={() => handleDeactivate(user._id)}
                />
              ) : user.status === "inactive" ||
                user.status === "pending_deactivation" ? (
                <MdToggleOff
                  className="cursor-pointer text-yellow-500 hover:text-yellow-700"
                  onClick={() =>
                    handleActivate(user._id, user.username || user.email)
                  }
                />
              ) : user.status === "pending_deletion" ? (
                <MdCancel
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleCancelDelete(user._id)}
                />
              ) : null}
              <FaTrash
                className="cursor-pointer text-red-500 hover:text-red-700"
                onClick={() => handleDelete(user._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
            <img
              src={
                selectedUser.profile_image ||
                "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full border-4 border-violet-500 object-cover"
            />
            <h2 className="mt-4 text-xl font-semibold text-violet-500">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <p className="text-gray-600 dark:text-white">
              {selectedUser.email}
            </p>
            <p
              className={`text-sm mt-2 font-bold ${
                selectedUser.status === "active"
                  ? "text-green-600"
                  : "text-yellow-500"
              }`}
            >
              {selectedUser.status}
            </p>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
