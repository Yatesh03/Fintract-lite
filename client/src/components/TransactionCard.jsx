import React, { useState } from 'react'
import {CalendarDays, PiggyBank, Edit2, Trash2, X, Check } from 'lucide-react';
import { useAppContext } from '../contexts/AppProvider';

function TransactionCard({item}) {
    const { updateTransaction, deleteTransaction } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        amount: item.amount,
        type: item.type,
        category: item.category,
        description: item.description
    });

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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            amount: item.amount,
            type: item.type,
            category: item.category,
            description: item.description
        });
    };

    const handleSave = async () => {
        try {
            await updateTransaction(item._id, editData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(item._id);
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (isEditing) {
        return (
            <div className="glass-card rounded-2xl p-6 border-2 border-blue-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <Edit2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Edit Transaction</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                                <input
                                    type="number"
                                    value={editData.amount}
                                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                                    className="input-modern w-full pl-10 pr-4 py-3 rounded-2xl font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Type</label>
                            <div className="relative">
                                <select
                                    value={editData.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    className="input-modern w-full pl-4 pr-10 py-3 rounded-2xl appearance-none cursor-pointer font-medium"
                                >
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Category</label>
                            <div className="relative">
                                <select
                                    value={editData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="input-modern w-full pl-4 pr-10 py-3 rounded-2xl appearance-none cursor-pointer font-medium"
                                >
                                    {(editData.type === 'Expense' ? expenseTypes : incomeTypes).map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Description</label>
                            <input
                                type="text"
                                value={editData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="input-modern w-full px-4 py-3 rounded-2xl font-medium"
                                placeholder="Transaction description"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="btn-modern flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-semibold transition-all duration-300"
                        >
                            <Check size={18} />
                            Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            className="btn-modern flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-2xl font-semibold transition-all duration-300"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl p-6 group card-hover relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${
                item.type === 'Expense' 
                ? 'from-red-400/5 to-orange-400/5' 
                : 'from-emerald-400/5 to-teal-400/5'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-xl shadow-lg ${
                            item.type === 'Expense' 
                            ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                        } text-white`}>
                            {item.type === 'Expense' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-slate-800 mb-1">{item.description}</h4>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    item.type === 'Expense' 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {item.category}
                                </span>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                    item.type === 'Expense' 
                                    ? 'bg-red-50 text-red-600' 
                                    : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                    {item.type}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-slate-500">
                                <CalendarDays size={14} className="mr-2" />
                                {new Date(item.date).toLocaleDateString('en-IN', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            {item.roundUpAmount && (
                                <div className="flex items-center text-sm text-purple-600 mt-2 bg-purple-50 px-3 py-1 rounded-lg">
                                    <PiggyBank size={14} className="mr-2" />
                                    <span className="font-medium">
                                        Saved ₹{item.roundUpAmount.toFixed(2)} • Rounded to ₹{item.actualAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className={`font-bold text-2xl bg-gradient-to-r ${
                            item.type === 'Expense' 
                            ? 'from-red-500 to-orange-500' 
                            : 'from-emerald-500 to-teal-600'
                        } bg-clip-text text-transparent`}>
                            ₹{parseFloat(item.amount).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={handleEdit}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Edit transaction"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Delete transaction"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionCard