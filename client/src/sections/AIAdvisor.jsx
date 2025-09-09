import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Brain, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { useAppContext } from '../contexts/AppProvider';

function AIAdvisor() {
  const { transactions, budgets, statistic } = useAppContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI Financial Advisor. I can help you analyze your spending patterns, suggest budget optimizations, and provide personalized financial advice. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Advanced AI Response Generator with comprehensive financial analysis
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Comprehensive financial analysis
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    // Detailed category analysis
    const expenseCategories = {};
    const incomeCategories = {};
    
    transactions.filter(t => t.type === 'Expense').forEach(t => {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    });
    
    transactions.filter(t => t.type === 'Income').forEach(t => {
      incomeCategories[t.category] = (incomeCategories[t.category] || 0) + t.amount;
    });
    
    const topExpenseCategory = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1])[0];
    const topIncomeCategory = Object.entries(incomeCategories).sort((a, b) => b[1] - a[1])[0];

    // Recent spending trends (last 7 days)
    const recentTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return transactionDate >= sevenDaysAgo;
    });

    const recentSpending = recentTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Advanced response generation
    if (message.includes('spending') || message.includes('expense') || message.includes('spend')) {
      const analysis = [];
      analysis.push(`📊 **Spending Analysis:**`);
      analysis.push(`• This month: Rs. ${totalExpenses.toFixed(2)}`);
      analysis.push(`• Last 7 days: Rs. ${recentSpending.toFixed(2)}`);
      analysis.push(`• Top category: ${topExpenseCategory ? topExpenseCategory[0] : 'N/A'} (Rs. ${topExpenseCategory ? topExpenseCategory[1].toFixed(2) : '0'})`);
      
      if (topExpenseCategory && topExpenseCategory[1] > totalExpenses * 0.3) {
        analysis.push(`\n⚠️ **Warning:** ${topExpenseCategory[0]} represents ${((topExpenseCategory[1] / totalExpenses) * 100).toFixed(1)}% of your spending. Consider diversifying expenses.`);
      }
      
      analysis.push(`\n💡 **Recommendation:** Try the 50/30/20 rule - 50% needs, 30% wants, 20% savings.`);
      
      return analysis.join('\n');
    }
    
    if (message.includes('budget') || message.includes('budgeting')) {
      const budgetAnalysis = [];
      budgetAnalysis.push(`💰 **Budget Analysis:**`);
      
      if (budgets.length > 0) {
        budgetAnalysis.push(`• You have ${budgets.length} budget categories`);
        budgetAnalysis.push(`• Total budget: Rs. ${budgets.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}`);
        
        const budgetUsage = budgets.map(budget => {
          const spent = expenseCategories[budget.category] || 0;
          const percentage = (spent / budget.amount) * 100;
          return { ...budget, spent, percentage };
        });
        
        const overBudget = budgetUsage.filter(b => b.percentage > 100);
        if (overBudget.length > 0) {
          budgetAnalysis.push(`\n⚠️ **Over Budget Categories:**`);
          overBudget.forEach(b => {
            budgetAnalysis.push(`• ${b.category}: ${b.percentage.toFixed(1)}% (Rs. ${b.spent.toFixed(2)} / Rs. ${b.amount.toFixed(2)})`);
          });
        }
      } else {
        budgetAnalysis.push(`• No budgets set yet`);
        budgetAnalysis.push(`\n💡 **Smart Budget Suggestions:**`);
        Object.entries(expenseCategories)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .forEach(([cat, amount]) => {
            const suggestedBudget = Math.ceil(amount * 1.1); // 10% buffer
            budgetAnalysis.push(`• ${cat}: Rs. ${suggestedBudget.toFixed(2)} (based on Rs. ${amount.toFixed(2)} spent)`);
          });
      }
      
      return budgetAnalysis.join('\n');
    }
    
    if (message.includes('save') || message.includes('saving') || message.includes('savings')) {
      const savingsAnalysis = [];
      savingsAnalysis.push(`💎 **Savings Analysis:**`);
      savingsAnalysis.push(`• Current savings rate: ${savingsRate}%`);
      savingsAnalysis.push(`• Monthly balance: Rs. ${balance.toFixed(2)}`);
      
      if (savingsRate < 10) {
        savingsAnalysis.push(`\n⚠️ **Low Savings Rate:** Your savings rate is below the recommended 20%.`);
        savingsAnalysis.push(`\n💡 **Quick Wins:**`);
        savingsAnalysis.push(`• Reduce dining out by 30%`);
        savingsAnalysis.push(`• Cancel unused subscriptions`);
        savingsAnalysis.push(`• Use the round-up feature for automatic savings`);
      } else if (savingsRate < 20) {
        savingsAnalysis.push(`\n✅ **Good Progress:** You're building savings habits!`);
        savingsAnalysis.push(`\n💡 **Next Steps:** Try to reach 20% savings rate for financial security.`);
      } else {
        savingsAnalysis.push(`\n🎉 **Excellent!** You're maintaining a healthy savings rate!`);
      }
      
      if (savings?.totalSaved > 0) {
        savingsAnalysis.push(`\n🐷 **Smart Savings:** Rs. ${savings.totalSaved.toFixed(2)} saved through round-ups!`);
      }
      
      return savingsAnalysis.join('\n');
    }
    
    if (message.includes('advice') || message.includes('help') || message.includes('analyze')) {
      const comprehensiveAnalysis = [];
      comprehensiveAnalysis.push(`📈 **Comprehensive Financial Analysis:**`);
      comprehensiveAnalysis.push(`\n💰 **Income & Expenses:**`);
      comprehensiveAnalysis.push(`• Monthly Income: Rs. ${totalIncome.toFixed(2)}`);
      comprehensiveAnalysis.push(`• Monthly Expenses: Rs. ${totalExpenses.toFixed(2)}`);
      comprehensiveAnalysis.push(`• Net Balance: Rs. ${balance.toFixed(2)}`);
      comprehensiveAnalysis.push(`• Savings Rate: ${savingsRate}%`);
      
      comprehensiveAnalysis.push(`\n📊 **Top Categories:**`);
      if (topExpenseCategory) {
        comprehensiveAnalysis.push(`• Highest Expense: ${topExpenseCategory[0]} (Rs. ${topExpenseCategory[1].toFixed(2)})`);
      }
      if (topIncomeCategory) {
        comprehensiveAnalysis.push(`• Primary Income: ${topIncomeCategory[0]} (Rs. ${topIncomeCategory[1].toFixed(2)})`);
      }
      
      comprehensiveAnalysis.push(`\n🎯 **Recommendations:**`);
      if (balance < 0) {
        comprehensiveAnalysis.push(`• ⚠️ You're spending more than you earn`);
        comprehensiveAnalysis.push(`• Focus on reducing expenses or increasing income`);
        comprehensiveAnalysis.push(`• Consider emergency fund of 3-6 months expenses`);
      } else if (savingsRate < 20) {
        comprehensiveAnalysis.push(`• ✅ Living within means, but increase savings`);
        comprehensiveAnalysis.push(`• Aim for 20% savings rate`);
        comprehensiveAnalysis.push(`• Build emergency fund`);
      } else {
        comprehensiveAnalysis.push(`• 🎉 Excellent financial health!`);
        comprehensiveAnalysis.push(`• Consider investment opportunities`);
        comprehensiveAnalysis.push(`• Plan for long-term goals`);
      }
      
      return comprehensiveAnalysis.join('\n');
    }
    
    if (message.includes('category') || message.includes('categories') || message.includes('breakdown')) {
      const categoryAnalysis = [];
      categoryAnalysis.push(`📋 **Spending Breakdown:**`);
      
      if (Object.keys(expenseCategories).length > 0) {
        Object.entries(expenseCategories)
          .sort((a, b) => b[1] - a[1])
          .forEach(([cat, amount], index) => {
            const percentage = ((amount / totalExpenses) * 100).toFixed(1);
            const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊';
            categoryAnalysis.push(`${emoji} ${cat}: Rs. ${amount.toFixed(2)} (${percentage}%)`);
          });
        
        categoryAnalysis.push(`\n💡 **Optimization Tips:**`);
        const top3 = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1]).slice(0, 3);
        top3.forEach(([cat, amount], index) => {
          const percentage = ((amount / totalExpenses) * 100).toFixed(1);
          if (percentage > 30) {
            categoryAnalysis.push(`• ${cat}: Consider reducing by 15-20%`);
          }
        });
      } else {
        categoryAnalysis.push(`No expense data available yet.`);
      }
      
      return categoryAnalysis.join('\n');
    }

    if (message.includes('goal') || message.includes('target') || message.includes('plan')) {
      return `🎯 **Financial Goal Setting:**\n\n**Short-term Goals (1-3 months):**\n• Build emergency fund (3-6 months expenses)\n• Pay off high-interest debt\n• Track all expenses daily\n\n**Medium-term Goals (3-12 months):**\n• Increase savings rate to 20%\n• Create detailed budget\n• Start investment portfolio\n\n**Long-term Goals (1+ years):**\n• Retirement planning\n• Major purchases (house, car)\n• Financial independence\n\n💡 **Pro Tip:** Use SMART goals - Specific, Measurable, Achievable, Relevant, Time-bound.`;
    }

    if (message.includes('debt') || message.includes('loan') || message.includes('credit')) {
      return `💳 **Debt Management:**\n\n**Debt Payoff Strategies:**\n• **Avalanche Method:** Pay highest interest first\n• **Snowball Method:** Pay smallest balance first\n• **Debt Consolidation:** Combine multiple debts\n\n**Quick Actions:**\n• List all debts with interest rates\n• Create payoff timeline\n• Consider balance transfers\n• Avoid new debt\n\n💡 **Remember:** Every extra payment reduces interest significantly!`;
    }

    if (message.includes('investment') || message.includes('invest') || message.includes('stock')) {
      return `📈 **Investment Guidance:**\n\n**Start with:**\n• Emergency fund (3-6 months)\n• High-yield savings account\n• Index funds/ETFs\n• Retirement accounts (401k, IRA)\n\n**Investment Principles:**\n• Diversify your portfolio\n• Invest regularly (dollar-cost averaging)\n• Think long-term (5+ years)\n• Keep fees low\n\n⚠️ **Disclaimer:** This is general advice. Consult a financial advisor for personalized guidance.`;
    }

    // Enhanced default responses with more personality
    const smartResponses = [
      `🤖 I'm here to help with your financial journey! I can analyze your spending patterns, suggest budget optimizations, provide savings strategies, or help with financial planning. What would you like to explore?`,
      
      `💡 Based on your financial data, I can provide insights on spending habits, budget management, savings optimization, debt strategies, or investment guidance. What interests you most?`,
      
      `📊 I've analyzed your transaction history and can help with comprehensive financial analysis, category breakdowns, goal setting, or specific financial challenges. What would you like to discuss?`,
      
      `🎯 Let's make your money work smarter! I can help with spending analysis, budget creation, savings strategies, financial goal setting, or answer specific money questions. What's on your mind?`
    ];
    
    return smartResponses[Math.floor(Math.random() * smartResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Analyze my spending",
    "Help with budgeting", 
    "Savings advice",
    "Show my top categories",
    "Financial goals",
    "Debt management",
    "Investment tips",
    "Comprehensive analysis"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Brain size={28} />
          <h1 className="text-2xl font-bold">AI Financial Advisor</h1>
        </div>
        <p className="text-purple-100">
          Get personalized financial advice based on your spending patterns and financial goals.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-500" size={20} />
            <span className="font-semibold text-gray-700">This Month</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            Rs. {statistic?.income ? statistic.income.toFixed(2) : '0.00'}
          </p>
          <p className="text-sm text-gray-500">Income</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-500" size={20} />
            <span className="font-semibold text-gray-700">Expenses</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            Rs. {statistic?.expense ? statistic.expense.toFixed(2) : '0.00'}
          </p>
          <p className="text-sm text-gray-500">This Month</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="text-blue-500" size={20} />
            <span className="font-semibold text-gray-700">Savings Rate</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {statistic?.savingRate ? statistic.savingRate + '%' : '0%'}
          </p>
          <p className="text-sm text-gray-500">This Month</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Bot size={16} />
                    <span className="text-xs font-semibold">AI Advisor</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={16} />
                  <span className="text-xs font-semibold">AI Advisor</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="border-t border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAdvisor;
