import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { SiDatabricks } from "react-icons/si";
import { MdDescription } from "react-icons/md";
import { showToast } from '../Custom/ToastUtil';
import CustomLoader from '../Custom/CustomLoader';

export const AddTransactionType = () => {
    const [editingCategory, setEditingCategory] = useState(null);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const location = useLocation();
    const navigate = useNavigate();

    const user_id = localStorage.getItem("id");
    const role_id = localStorage.getItem("role_id");
    const role_name = localStorage.getItem("role");

    useEffect(() => {
        const stateCategory = location.state?.category;
        if (stateCategory) {
            setEditingCategory(stateCategory);
            setValue("name", stateCategory.name);
            setValue("description", stateCategory.description || "");
        }
    }, [location.state, setValue]);

    const onSubmit = async (data) => {
        const payload = {
          name: data.name.trim(),
          description: data.description?.trim() || "",
        };
      
        try {
          let response;
          if (editingCategory && editingCategory._id) {
            response = await axios.put(`/updateCategory/${editingCategory._id}`, payload);
            alert(response.data.message);
            reset();
            navigate("/admin/transactiontypelist");
          } else {
            response = await axios.post("/addCategory", {
              ...payload,
              user_id,
              role_id,
              role_name,
            });
            alert(response.data.message);
            reset();
          }
        } catch (err) {
          console.error("Error adding/editing category:", err.response?.data || err.message);
          alert("Something went wrong.");
        }
      };
      

    // Frontend validation rules
    const validation = {
        name: {
            required: "Transaction type name is required",
            minLength: { value: 3, message: "Minimum 3 characters required" },
        },
        description: {
            minLength: { value: 5, message: "Minimum 5 characters required" },
        },
    };

    return (
        <div className="min-h-screen p-4 bg-white dark:bg-gray-950 text-violet-500">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto space-y-6 bg-white dark:bg-slate-700 p-6 rounded-xl border border-violet-500 shadow"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-1 text-violet-500">
                        {editingCategory ? "Edit Transaction Type" : "Add Transaction Type"}
                    </h2>
                    <p className="text-violet-500 font-medium">Fill in the details below.</p>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-violet-500 font-medium">
                        <SiDatabricks /> Name
                    </label>
                    <input
                        type="text"
                        {...register("name", validation.name)}
                        placeholder="Enter transaction type name"
                        className="w-full mt-1 p-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="flex items-center gap-2 text-violet-500 font-medium">
                        <MdDescription /> Description
                    </label>
                    <textarea
                        {...register("description", validation.description)}
                        placeholder="Optional description"
                        rows="3"
                        className="w-full mt-1 p-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2 rounded hover:from-indigo-800 hover:to-purple-800 transition"
                >
                    {editingCategory ? "Update Transaction Type" : "Add Transaction Type"}
                </button>
            </form>
        </div>
    );
};
