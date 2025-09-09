import React, { useState, useEffect } from 'react';
import { PiggyBank, TrendingUp, Target, Wallet, Plus, Minus, Settings } from 'lucide-react';
import { useAppContext } from '../contexts/AppProvider';
import toast from 'react-hot-toast';

function SavingsWallet() {
  const { user } = useAppContext();
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Fetch savings data
  const fetchSavings = async () => {
    try {
      console.log('Fetching savings data...');
      const response = await fetch('/api/savings', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Savings response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Savings API error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Savings data received:', data);
      setSavings(data);
    } catch (error) {
      console.error('Error fetching savings:', error);
      toast.error('Failed to load savings data');
      // Set default savings data if fetch fails
      setSavings({
        totalSaved: 0,
        roundUpAmount: 0,
        monthlyGoal: 0,
        lastUpdated: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  // Update monthly goal
  const handleUpdateGoal = async () => {
    if (!monthlyGoal || parseFloat(monthlyGoal) <= 0) {
      toast.error('Please enter a valid goal amount');
      return;
    }

    try {
      console.log('Updating goal with amount:', monthlyGoal);
      const response = await fetch('/api/savings/goal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ monthlyGoal: parseFloat(monthlyGoal) })
      });
      
      console.log('Goal update response status:', response.status);
      
      if (response.ok) {
        const updatedSavings = await response.json();
        console.log('Updated savings data:', updatedSavings);
        setSavings(updatedSavings);
        setShowGoalModal(false);
        setMonthlyGoal('');
        toast.success('Monthly goal updated!');
      } else {
        const errorData = await response.json();
        console.error('Goal update error:', errorData);
        toast.error(errorData.message || 'Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  // Withdraw from savings
  const handleWithdraw = async () => {
    if (parseFloat(withdrawAmount) > savings.totalSaved) {
      toast.error('Insufficient savings balance');
      return;
    }

    try {
      const response = await fetch('/api/savings/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) })
      });
      
      if (response.ok) {
        const updatedSavings = await response.json();
        setSavings(updatedSavings);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        toast.success('Withdrawal successful!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error('Withdrawal failed');
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const goalProgress = savings?.monthlyGoal > 0 
    ? Math.min((savings.totalSaved / savings.monthlyGoal) * 100, 100)
    : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <PiggyBank className="text-purple-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Savings Wallet</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Target size={16} />
            Set Goal
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={!savings?.totalSaved || savings.totalSaved <= 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            <Minus size={16} />
            Withdraw
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Savings */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet size={24} />
            <span className="text-purple-200 text-sm font-medium">Total Saved</span>
          </div>
          <p className="text-3xl font-bold">Rs. {savings?.totalSaved?.toFixed(2) || '0.00'}</p>
          <p className="text-purple-200 text-sm mt-1">All time savings</p>
        </div>

        {/* Round-up Savings */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={24} />
            <span className="text-green-200 text-sm font-medium">Round-ups</span>
          </div>
          <p className="text-3xl font-bold">Rs. {savings?.roundUpAmount?.toFixed(2) || '0.00'}</p>
          <p className="text-green-200 text-sm mt-1">From smart round-ups</p>
        </div>

        {/* Monthly Goal Progress */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target size={24} />
            <span className="text-blue-200 text-sm font-medium">Monthly Goal</span>
          </div>
          <p className="text-3xl font-bold">
            {savings?.monthlyGoal ? `${goalProgress.toFixed(0)}%` : 'Not Set'}
          </p>
          <p className="text-blue-200 text-sm mt-1">
            {savings?.monthlyGoal 
              ? `Rs. ${savings.totalSaved?.toFixed(2)} / ${savings.monthlyGoal.toFixed(2)}`
              : 'Set a monthly goal'
            }
          </p>
        </div>
      </div>

      {/* Goal Progress Bar */}
      {savings?.monthlyGoal > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold mb-4">Monthly Goal Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Rs. 0</span>
            <span className="font-medium">
              {goalProgress >= 100 ? 'Goal Achieved! 🎉' : `${goalProgress.toFixed(1)}% Complete`}
            </span>
            <span>Rs. {savings.monthlyGoal.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* How it Works */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings size={20} />
          How Smart Round-ups Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-2">Make a Purchase</h4>
            <p className="text-gray-600 text-sm">
              When you spend Rs. 53, the system automatically rounds it up to Rs. 60
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-2">Auto-Save</h4>
            <p className="text-gray-600 text-sm">
              The difference (Rs. 7) is automatically added to your savings wallet
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-2">Grow Savings</h4>
            <p className="text-gray-600 text-sm">
              Watch your savings grow effortlessly with every purchase you make
            </p>
          </div>
        </div>
      </div>

      {/* Set Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Set Monthly Savings Goal</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Goal Amount (Rs.)
              </label>
              <input
                type="number"
                value={monthlyGoal}
                onChange={(e) => setMonthlyGoal(e.target.value)}
                placeholder="Enter your monthly savings goal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateGoal}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Set Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Withdraw from Savings</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount (Rs.)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={`Max: Rs. ${savings?.totalSaved?.toFixed(2) || '0.00'}`}
                max={savings?.totalSaved || 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available balance: Rs. {savings?.totalSaved?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavingsWallet;
