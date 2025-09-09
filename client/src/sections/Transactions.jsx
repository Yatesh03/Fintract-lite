import React, { useState, useEffect } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { useAppContext } from '../contexts/AppProvider';
import TransactionCard from '../components/TransactionCard';


function TransactionHistory() {
  const { transactions,search,setSearch } = useAppContext();
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    let temp = [...transactions];

    // Filter by type
    if (typeFilter !== 'All') {
      temp = temp.filter((t) => t.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // Enhanced search across multiple fields
    if (search) {
      const searchTerm = search.toLowerCase();
      temp = temp.filter((t) =>
        t.description.toLowerCase().includes(searchTerm) ||
        t.category.toLowerCase().includes(searchTerm) ||
        t.type.toLowerCase().includes(searchTerm) ||
        t.amount.toString().includes(searchTerm)
      );
    }

    // Sort
    if (sortBy === 'Date') {
      temp.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'Amount') {
      temp.sort((a, b) => b.amount - a.amount);
    }

    setFiltered(temp);
  }, [search, typeFilter, sortBy, transactions]);

  return (
    <div className="w-full">

      <div className="rounded-xl bg-white p-6 border border-gray-200 mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ArrowDownUp className="text-blue-500" size={20} /> Filter Transactions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Date">Date</option>
            <option value="Amount">Amount</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">
            Transaction History
          </h3>
          {search && (
            <div className="text-sm text-gray-500">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-2">
                {search ? 'No transactions found matching your search.' : 'No transactions found.'}
              </p>
              {search && (
                <p className="text-gray-400 text-sm">
                  Try searching for a different term or clear the search to see all transactions.
                </p>
              )}
            </div>
          ) : (
            filtered.map((item, index) => (
              <TransactionCard item={item} key={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
