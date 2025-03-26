import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaEdit, FaLock, FaCamera, FaTrash, FaBan } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import axios from "axios";

export const UserProfile = () => {

  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);

  const {
    register: registerUserInfo,
    handleSubmit: handleSubmitUserInfo,
    formState: { errors: userInfoErrors },
    setValue,
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm();


  const [userData, setUser] = useState({
    username: "",
    email: "",
    profile_image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch user ID from local storage
  const user_id = localStorage.getItem("id"); // Assuming 'id' is the key where user ID is stored

  // Fetch user profile data
  useEffect(() => {
    if (user_id) {
      axios.get(`/user/profile/${user_id}`)
        .then((res) => {
          console.log("Profile Data:", res.data); // Log the response
          if (res.data) {
            setUser({
              username: res.data.username || "User  ",
              email: res.data.email || "email@example.com",
              profile_image: res.data.profile_image || null
            });
            // Set form values using setValue
            setValue("username", res.data.username || "");
            setValue("email", res.data.email || "");
          }
        })
        .catch((err) => console.error("Error fetching profile data:", err));
    }
  }, [user_id, setValue]);

  const updateUsernameAndEmail = async (data) => {
    const userId = user_id; // Use the user ID from local storage

    // Update username if it has changed
    if (data.username !== userData.username) {
      await axios.put(`/update-username/${userId}`, { new_username: data.username });
      console.log("Updated Username:", data.username);
    }

    // Update email if it has changed
    if (data.email !== userData.email) {
      await axios.put(`/update-email/${userId}`, { new_email: data.email });
      console.log("Updated Email:", data.email);
    }
  };

  const updatePassword = async (data) => {
    const userId = user_id; // Use the user ID from local storage
    await axios.put(`/change-password/${userId}`, {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    });
    console.log("Updated Password");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      console.log("Image selected:", file);

      // Call image upload function automatically
      handleImageUpload(file);
    } else {
      console.error("No image selected!");
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      console.error("No image selected!");
      alert("Please select an image first!");
      return;
    }

    const userId = user_id;
    const formData = new FormData();
    formData.append("image", file); // Make sure the backend expects "image"

    try {
      const response = await axios.put(`/update-profile-picture/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile picture updated:", response.data);
      alert("Profile picture updated successfully!");

      // Update UI with the new image
      setUser((prev) => ({ ...prev, profile_image: response.data.profile_image }));
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-6">
        <div className="max-w-8xl w-full flex bg-white dark:bg-gray-900 rounded-xl p-6">
          {/* Profile Picture Section (Left Side) */}
          <div className="flex flex-col items-center w-1/3 border-r border-violet-500 pr-6">
            <div className="relative">
              <div>
                {userData.profile_image ? (
                  <img
                    src={userData.profile_image}
                    alt="Profile"
                    className="h-80 w-80 rounded-full object-cover"
                  />
                ) : (
                  <IoPersonCircleOutline className="h-80 w-80 text-violet-500 border-4 border-violet-500 border-dotted rounded-full animate-border-glow" />

                )}
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  className="absolute bottom-7 right-7 bg-purple-700 text-white p-3 rounded-full hover:bg-violet-700 transition"
                  onClick={() => document.getElementById("fileInput").click()}  //Opens file picker
                >
                  <FaCamera className="text-lg" />
                </button>
              </div>
            </div>
            {/* Username under Profile Picture */}
            <div className="mt-4 flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow shadow-violet-500/100">
              <FaUser className="text-violet-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                <span className="text-gray-700 dark:text-gray-500">Username:</span> {userData.username}
              </h3>
            </div>

            {/* Email under Profile Picture */}
            <div className="mt-3 flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow shadow-violet-500/100">
              <FaEnvelope className="text-violet-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                <span className="text-gray-700 dark:text-gray-500">Email:</span> {userData.email}
              </h3>
            </div>

            {/* Delete & Deactivate Buttons */}
            <div className="mt-12 flex flex-col space-y-4 w-full">
              <button className="bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-800 
              hover:to-rose-900 text-red-200 font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-red-600 text-center py-2 px-4 rounded flex items-center justify-center w-full">
                <FaTrash className="mr-2" /> Delete
              </button>
              <button className="bg-gradient-to-r from-yellow-500 to-orange-700 hover:from-yellow-800 
              hover:to-orange-900 text-red-200 font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-yellow-600 text-center py-2 px-4 rounded flex items-center justify-center w-full">
                <FaBan className="mr-2" /> Deactivate
              </button>
            </div>
          </div>

          {/* Forms Section (Right Side) */}
          <div className="w-2/3 pl-6">
            <div className="border-b border-violet-500"><h1 className="mb-6 text-4xl text-center font-extrabold text-violet-500">Welcome</h1></div>

            {/* Update Username and Email Form */}
            <form onSubmit={handleSubmitUserInfo(updateUsernameAndEmail)} className="space-y-6">
              <h2 className="mt-8 text-lg font-semibold text-violet-500 text-center">Update Username and Email</h2>
              <div>
                <label htmlFor="username" className="text-sm font-medium text-violet-500">Username</label>
                <div className="relative">
                  <FaUser className="absolute top-3 left-3 text-violet-500" />
                  <input
                    {...registerUserInfo("username", { required: "Username is required" })}
                    type="text"
                    id="username"
                    className={`mt-1 block w-full border border-violet-500 rounded-md shadow-sm py-2 px-4 pl-10 
                      transition-all duration-300 
                      ${isUsernameEditing ? "bg-white text-black" : "bg-slate-300 text-violet-500 font-semibold cursor-not-allowed"}`}
                    placeholder="Your username"
                    defaultValue={userData.username}
                    disabled={!isUsernameEditing}
                  />
                  <FaEdit
                    className="absolute right-3 top-3 text-violet-500 cursor-pointer hover:text-violet-300 transition"
                    onClick={() => setIsUsernameEditing(!isUsernameEditing)}
                  />
                </div>
                {userInfoErrors.username && <span className="text-xs text-red-500">{userInfoErrors.username.message}</span>}
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-violet-500">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute top-3 left-3 text-violet-500" />
                  <input
                    type="email"
                    id="email"
                    {...registerUserInfo("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    className={`mt-1 block w-full border border-violet-500 rounded-md shadow-sm py-2 px-4 pl-10 
                      transition-all duration-300 
                      ${isEmailEditing ? "bg-white text-black" : "bg-slate-300 text-violet-500 font-semibold cursor-not-allowed"}`}
                    placeholder="Your email"
                    defaultValue={userData.email}
                    disabled={!isEmailEditing}
                  />
                  <FaEdit
                    className="absolute right-3 top-3 text-violet-500 cursor-pointer hover:text-violet-300 transition"
                    onClick={() => setIsEmailEditing(!isEmailEditing)}
                  />
                </div>
                {userInfoErrors.email && <span className="text-xs text-red-500">{userInfoErrors.email.message}</span>}
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-1/5 bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none 
                  focus:shadow-outline transition"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Update Password Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-violet-500 mb-4 text-center">Update Password</h3>

              <form onSubmit={handleSubmitPassword(updatePassword)} className="space-y-6">
                {/* Hidden Username Field for Autofill */}
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  defaultValue={userData.username}
                  className="hidden"
                />

                {/* Current Password Field */}
                <div>
                  <label htmlFor="currentPassword" className="text-sm font-medium text-violet-500">Current Password</label>
                  <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-violet-500" />
                    <input
                      {...registerPassword("currentPassword", { required: "Current password is required" })}
                      type="password"
                      id="currentPassword"
                      className={`mt-1 block w-full border border-violet-500 rounded-md shadow-sm py-2 px-4 pl-10 
                        transition-all duration-300 
                        ${isPasswordEditing ? "bg-white text-black" : "bg-slate-300 cursor-not-allowed"}`}
                      placeholder="Current password"
                      autoComplete="current-password"
                      disabled={!isPasswordEditing}
                    />
                    <FaEdit
                      className="absolute right-3 top-3 text-violet-500 cursor-pointer hover:text-violet-300 transition"
                      onClick={() => setIsPasswordEditing(!isPasswordEditing)}
                    />
                  </div>
                  {passwordErrors.currentPassword && <span className="text-xs text-red-500">{passwordErrors.currentPassword.message}</span>}
                </div>

                {/* New Password Field */}
                <div>
                  <label htmlFor="newPassword" className="text-sm font-medium text-violet-500">New Password</label>
                  <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-violet-500" />
                    <input
                      {...registerPassword("newPassword", { required: "New password is required" })}
                      type="password"
                      id="newPassword"
                      className={`mt-1 block w-full border border-violet-500 rounded-md shadow-sm py-2 px-4 pl-10 
                        transition-all duration-300 
                        ${isPasswordEditing ? "bg-white text-black" : "bg-slate-300 cursor-not-allowed"}`}
                      placeholder="New password"
                      autoComplete="new-password"
                      disabled={!isPasswordEditing}
                    />
                  </div>
                  {passwordErrors.newPassword && <span className="text-xs text-red-500">{passwordErrors.newPassword.message}</span>}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-violet-500">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-violet-500" />
                    <input
                      {...registerPassword("confirmPassword", { required: "Confirm password is required" })}
                      type="password"
                      id="confirmPassword"
                      className={`mt-1 block w-full border border-violet-500 rounded-md shadow-sm py-2 px-4 pl-10 
                        transition-all duration-300 
                        ${isPasswordEditing ? "bg-white text-black" : "bg-slate-300  cursor-not-allowed"}`}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      disabled={!isPasswordEditing}
                    />
                  </div>
                  {passwordErrors.confirmPassword && <span className="text-xs text-red-500">{passwordErrors.confirmPassword.message}</span>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="w-1/5 bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none 
      focus:shadow-outline transition"
                  >
                    Update Password
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};