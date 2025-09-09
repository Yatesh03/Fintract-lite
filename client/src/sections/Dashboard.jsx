import React from 'react'
import MoneyCard from '../components/MoneyCard'
import SimpleLineChart from '../components/SimpleLineChart'
import PieChart from '../components/PieChart'
import { useAppContext } from '../contexts/AppProvider'
import { PiggyBank, TrendingUp } from 'lucide-react'

function Dashboard() {
  const { statistic, yearData, savings } = useAppContext();
  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='grid xl:grid-cols-2 grid-cols-1 gap-4'>
          <MoneyCard title={"Total Balance"} amount={statistic.balance}
            icon={"$"} style={"text-green-600"} textColor={statistic.balance >= 0 ? "text-green-500" : "text-red-500"} />
          <MoneyCard title={"Monthly Income"} amount={statistic.income} icon={"+"} style={"text-blue-500"} />
        </div>
        
        <div className='grid xl:grid-cols-2 grid-cols-1 gap-4'>
          <MoneyCard title={"Monthly Expenses"} amount={statistic.expense} icon={"-"} style={"text-red-600"} textColor="text-red-600" />
          <MoneyCard title={"Savings Rate"} isPrice={false}
          amount={statistic.savingRate + "%"} textColor={statistic.savingRate >= 0 ? "text-green-500" : "text-red-500"}
            icon={"%"} color={""} style={"text-black"} />
        </div>
      </div>

      {/* Savings Section */}
      {savings && (
        <div className='mt-6'>
          <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mb-4'>
            <div className='flex items-center gap-3 mb-4'>
              <PiggyBank size={28} />
              <h2 className='text-2xl font-bold'>Smart Savings</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-white/20 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <TrendingUp size={20} />
                  <span className='text-purple-100 text-sm font-medium'>Total Saved</span>
                </div>
                <p className='text-2xl font-bold'>Rs. {savings.totalSaved?.toFixed(2) || '0.00'}</p>
              </div>
              <div className='bg-white/20 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <PiggyBank size={20} />
                  <span className='text-purple-100 text-sm font-medium'>Round-ups</span>
                </div>
                <p className='text-2xl font-bold'>Rs. {savings.roundUpAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <div className='bg-white/20 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-purple-100 text-sm font-medium'>Monthly Goal</span>
                </div>
                <p className='text-2xl font-bold'>
                  {savings.monthlyGoal ? `Rs. ${savings.monthlyGoal.toFixed(2)}` : 'Not Set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 xl:grid-cols-2 mt-4 gap-4'>
        <div className='bg-white rounded-xl p-6 border border-gray-200'>
          <h3 className='font-semibold text-2xl'>Income vs Expenses</h3>
          <div className='mt-12'>
            <SimpleLineChart data={yearData} />
          </div>
        </div>
        <div className='bg-white rounded-xl p-6 border border-gray-200'>
          <h3 className='font-semibold text-2xl'>Expense Categories</h3>
          <div>
            <PieChart data={statistic?.categoryBreakdown} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard