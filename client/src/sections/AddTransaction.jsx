import React, { useState } from "react";
import { useAppContext } from "../contexts/AppProvider";
import toast from "react-hot-toast";

function AddTransaction() {
  // Access functions from the app's context
  const { addTransaction, getBudgetUsage } = useAppContext();

  // Local state for form inputs
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Expense");
  const [loading, setLoading] = useState(false); // Used to disable UI during submission

  // Predefined category options
  const expenseTypes = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Travel",
    "Other",
  ];

  const incomeTypes = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Gift",
    "Other",
  ];

  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!category || !amount || !type) {
      toast.error("Please select a type, category and enter an amount.");
      return;
    }

    setLoading(true); // Disable UI elements

    try {
      // Save transaction using context method
      await addTransaction({
        category,
        amount,
        type,
        description,
      });

      // Refresh budget data
      await getBudgetUsage();

      // Reset form fields
      setCategory("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Re-enable UI elements
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Add Transaction</h1>
            <p className="text-slate-600">Record your income and expenses</p>
          </div>
        </div>
      </div>

      {/* Form container */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-blue-600/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 space-y-8">
          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Transaction Type Selector */}
            <div className="space-y-3">
              <label htmlFor="type" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Transaction Type
              </label>
              <div className="relative">
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input-modern w-full pl-4 pr-10 py-3 rounded-2xl appearance-none cursor-pointer font-medium"
                  disabled={loading}
                >
                  {["Expense", "Income"].map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-slate-500 font-medium">₹</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-modern w-full pl-10 pr-4 py-3 rounded-2xl font-medium"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-3">
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-modern w-full pl-4 pr-10 py-3 rounded-2xl appearance-none cursor-pointer font-medium"
                  disabled={loading}
                >
                  <option value="">Choose category...</option>
                  {(type === "Expense" ? expenseTypes : incomeTypes).map(
                    (item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-3 lg:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Description
              </label>
              <input
                type="text"
                placeholder="Add a note about this transaction..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-modern w-full px-4 py-3 rounded-2xl font-medium"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end lg:col-span-1">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`btn-modern w-full py-3 px-6 rounded-2xl font-semibold text-white shadow-lg transition-all duration-300 ${
                  type === "Income"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{type === "Income" ? "Add Income" : "Add Expense"}</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Info Section */}
          {type === "Expense" && (
            <div className="glass rounded-2xl p-6 border border-blue-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Smart Round-Up Savings</h3>
                  <p className="text-sm text-slate-600">Your expense will be automatically rounded up to the nearest ₹10, and the difference will be saved!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
