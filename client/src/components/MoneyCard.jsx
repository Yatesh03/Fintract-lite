import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'

function MoneyCard({ title, icon, amount = 0, style, textColor = "", isPrice = true }) {
    const getGradientClass = () => {
        if (title.toLowerCase().includes('balance')) {
            return amount >= 0 ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-pink-600'
        }
        if (title.toLowerCase().includes('income')) {
            return 'from-blue-500 to-cyan-600'
        }
        if (title.toLowerCase().includes('expense')) {
            return 'from-orange-500 to-red-600'
        }
        if (title.toLowerCase().includes('savings')) {
            return 'from-purple-500 to-indigo-600'
        }
        return 'from-gray-500 to-slate-600'
    }

    const getIconComponent = () => {
        if (title.toLowerCase().includes('balance') || title.toLowerCase().includes('income')) {
            return <TrendingUp className="w-6 h-6" />
        }
        if (title.toLowerCase().includes('expense')) {
            return <TrendingDown className="w-6 h-6" />
        }
        if (title.toLowerCase().includes('savings') && !isPrice) {
            return <Percent className="w-6 h-6" />
        }
        return <DollarSign className="w-6 h-6" />
    }

    return (
        <div className='group relative w-full p-6 glass-card rounded-2xl card-hover overflow-hidden'>
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass()} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className='relative z-10'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wider'>
                        {title}
                    </h3>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${getGradientClass()} text-white shadow-lg`}>
                        {getIconComponent()}
                    </div>
                </div>
                
                <div className='space-y-1'>
                    {isPrice ? (
                        <div className='flex items-baseline gap-1'>
                            <span className='text-sm text-slate-500 font-medium'>₹</span>
                            <span className={`text-3xl font-bold bg-gradient-to-r ${getGradientClass()} bg-clip-text text-transparent`}>
                                {Math.abs(parseFloat(amount)).toLocaleString('en-IN', { 
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                })}
                            </span>
                        </div>
                    ) : (
                        <div className='flex items-baseline gap-1'>
                            <span className={`text-3xl font-bold bg-gradient-to-r ${getGradientClass()} bg-clip-text text-transparent`}>
                                {parseFloat(amount).toFixed(1)}
                            </span>
                            <span className='text-sm text-slate-500 font-medium'>%</span>
                        </div>
                    )}
                    
                    {/* Trend indicator for balance */}
                    {title.toLowerCase().includes('balance') && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                            amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {amount >= 0 ? (
                                <>
                                    <TrendingUp className="w-3 h-3" />
                                    <span>Positive Balance</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="w-3 h-3" />
                                    <span>Negative Balance</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Subtle border gradient */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getGradientClass()} opacity-20 p-[1px] pointer-events-none`}>
                <div className="w-full h-full bg-white rounded-2xl"></div>
            </div>
        </div>
    )
}

export default MoneyCard