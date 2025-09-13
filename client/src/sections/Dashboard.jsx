import React from 'react'
import MoneyCard from '../components/MoneyCard'
import SimpleLineChart from '../components/SimpleLineChart'
import PieChart from '../components/PieChart'
import { useAppContext } from '../contexts/AppProvider'
import { PiggyBank, TrendingUp, Target, Sparkles, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

function Dashboard() {
  const { statistic, yearData, savings } = useAppContext();
  
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold gradient-text">Financial Dashboard</h1>
          </div>
          <p className="text-slate-600 text-lg">Track your financial journey with smart insights</p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MoneyCard 
          title="Total Balance" 
          amount={statistic.balance}
          icon="$" 
          style="text-green-600" 
          textColor={statistic.balance >= 0 ? "text-green-500" : "text-red-500"} 
        />
        <MoneyCard 
          title="Monthly Income" 
          amount={statistic.income} 
          icon="+" 
          style="text-blue-500" 
        />
        <MoneyCard 
          title="Monthly Expenses" 
          amount={statistic.expense} 
          icon="-" 
          style="text-red-600" 
          textColor="text-red-600" 
        />
        <MoneyCard 
          title="Savings Rate" 
          isPrice={false}
          amount={statistic.savingRate} 
          textColor={statistic.savingRate >= 0 ? "text-green-500" : "text-red-500"}
          icon="%" 
          style="text-black" 
        />
      </div>

      {/* Smart Savings Section */}
      {savings && (
        <div className="relative">
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl">
                  <PiggyBank className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Smart Savings</h2>
                  <p className="text-slate-600">Automated round-up savings in action</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-2xl p-6 border border-purple-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-slate-600 text-sm font-semibold uppercase tracking-wide">Total Saved</span>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    ₹{savings.totalSaved?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Across all savings</p>
                </div>

                <div className="glass rounded-2xl p-6 border border-purple-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                    <span className="text-slate-600 text-sm font-semibold uppercase tracking-wide">Round-ups</span>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                    ₹{savings.roundUpAmount?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">From transactions</p>
                </div>

                <div className="glass rounded-2xl p-6 border border-purple-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-slate-600 text-sm font-semibold uppercase tracking-wide">Monthly Goal</span>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    {savings.monthlyGoal ? `₹${savings.monthlyGoal.toFixed(2)}` : 'Not Set'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Target amount</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Income vs Expenses</h3>
                <p className="text-sm text-slate-600">Monthly financial trends</p>
              </div>
            </div>
            <div className="mt-6">
              <SimpleLineChart data={yearData} />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
                <PieChartIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Expense Categories</h3>
                <p className="text-sm text-slate-600">Spending breakdown</p>
              </div>
            </div>
            <div className="mt-6">
              <PieChart data={statistic?.categoryBreakdown} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard