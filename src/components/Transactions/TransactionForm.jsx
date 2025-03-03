import React from 'react'
import { useForm } from "react-hook-form";
import { FaRupeeSign, FaCalendarAlt, FaRegCommentDots, FaWallet } from "react-icons/fa";


export const TransactionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission logic here
  };

  // Validation rules
  const validationRules = {
    type: {
      required: {
        value: true,
        message: "Transaction type is required",
      },
      validate: (value) => 
        ["income", "expense"].includes(value) || "Invalid transaction type",
    },
    amount: {
      required: {
        value: true,
        message: "Amount is required",
      },
      validate: (value) => value > 0 || "Amount must be positive",
    },
    category: {
      required: {
        value: true,
        message: "Category is required",
      },
    },
    date: {
      required: {
        value: true,
        message: "Date is required",
      },
    },
    description: {
      // Optional field, no validation needed
    },
  };
  return (
    // // <div className="min-h-screen bg-white dark:bg-gray-950  flex items-center justify-center w-full transition-colors duration-300 ">

    // {/* <div className="w-full max-w-lg  mx-auto my-10 bg-white dark:bg-slate-700 p-6 rounded-lg border border-violet-500 "> */}
   
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-6 transition-colors duration-300">
   <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto my-0 bg-white dark:bg-slate-700 p-6  rounded-xl shadow-lg space-y-3 border border-violet-500 "
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-violet-500 ">Transaction Details</h2>
        <p className="text-violet-500 font-medium">Fill in the details below.</p>
      </div>

      {/* Transaction Type Field */}
      <div className="space-y-2">
        <label
          htmlFor="type"
          className="flex gap-2 items-center text-violet-500  font-medium"
        >
          <FaWallet className="text-violet-500" />
          <span>Type</span>
        </label>
        <select
          {...register("type", validationRules.type)}
          id="type"
          className="block w-full p-2 mt-1 border border-violet-300 rounded-md shadow-sm focus:border-violet-500 
          focus:ring focus:ring-violet-500 focus:ring-opacity-50"
        >
          <option value="">Select transaction type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <span className="text-red-500 text-xs">
                        {
                            errors.type?.message
                        }
                    </span>
      </div>

      {/* Amount Field */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="amount" className="text-violet-500  font-medium">
          <FaRupeeSign className="inline mr-2 text-violet-500" />
          Amount
        </label>
        <input
          type="number"
          {...register("amount", validationRules.amount)}
          id="amount"
          placeholder="Amount"
          className="w-full border border-violet-300 rounded-md shadow-sm py-2 px-3 focus:border-violet-500 
          focus:ring focus:ring-violet-500 focus:ring-opacity-50"
        />
        <span className="text-red-500 text-xs">
                        {
                            errors.amount?.message
                        }
                    </span>
      </div>

      {/* Category Field */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="category" className="text-violet-500  font-medium">
          <FaRegCommentDots className="inline mr-2 text-violet-500" />
          Category
        </label>
        <select
          {...register("category", validationRules.category)}
          id="category"
          className="w-full border border-violet-300 rounded-md shadow-sm py-2 px-3  
          focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 "
        >
          <option value="">Select a category</option>
          {/* Add category options here */}
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <span className="text-red-500 text-xs">
                        {
                            errors.category?.message
                        }
                    </span>
      </div>

      {/* Date Field */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="date" className="text-violet-500 font-medium">
          <FaCalendarAlt className="inline mr-2 text-violet-500" />
          Date
        </label>
        <input
          type="date"
          {...register("date", validationRules.date)}
          id="date"
          className="w-full border border-violet-300 rounded-md shadow-sm py-2 px-3 focus:border-violet-500 
          focus:ring focus:ring-violet-500 focus:ring-opacity-50"
        />
        <span className="text-red-500 text-xs">
                        {
                            errors.date?.message
                        }
                    </span>
      </div>

      {/* Description Field */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="description" className="text-violet-500  font-medium">
          <FaRegCommentDots className="inline mr-2 text-violet-500 " />
          Description (Optional)
        </label>
        <textarea
          {...register("description")}
          id="description"
          placeholder="Description"
          rows="3"
          className="w-full border border-violet-300 rounded-md shadow-sm py-2 px-3 focus:border-violet-500 
          focus:ring focus:ring-violet-500 focus:ring-opacity-50"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-800 hover:to-purple-800 
        text-violet-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
      >
        Submit Transaction
      </button>
    </form>
    
        </div>
        // </div>

  )
}
