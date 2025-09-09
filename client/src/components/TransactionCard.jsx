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
            <div className="bg-blue-50 px-4 py-4 rounded-xl border-2 border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            value={editData.amount}
                            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            value={editData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={editData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {(editData.type === 'Expense' ? expenseTypes : incomeTypes).map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            value={editData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                        <Check size={16} />
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        <X size={16} />
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center bg-gray-50 px-4 py-4 rounded-xl group hover:bg-gray-100 transition-colors">
            <div className="flex-1">
                <h4 className="font-bold text-lg text-black/80">{item.description}</h4>
                <p className="text-sm text-gray-500">{item.category}</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                    <CalendarDays size={14} className="mr-1" />
                    {new Date(item.date).toLocaleString()}
                </div>
                {item.roundUpAmount && (
                    <div className="flex items-center text-xs text-purple-600 mt-1">
                        <PiggyBank size={12} className="mr-1" />
                        Saved Rs. {item.roundUpAmount.toFixed(2)} (rounded up to Rs. {item.actualAmount.toFixed(2)})
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p
                        className={`font-bold text-xl
                            ${item.type === 'Expense' ? 'text-red-500' : 'text-green-600'
                            }`}
                    >
                        Rs.{parseFloat(item.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleEdit}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit transaction"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete transaction"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TransactionCard