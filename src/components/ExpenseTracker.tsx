import React from 'react';
import { Coffee, Home, Car, ShoppingBag, MoreHorizontal, Plus, X } from 'lucide-react';

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  time: string;
  date: string;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

const ExpenseTracker: React.FC = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([
    { id: 1, title: 'Dominos Pizza', category: 'Canteen', amount: -450, time: '2:30 PM', date: 'Today' },
    { id: 2, title: 'Metro Card Recharge', category: 'Transport', amount: -200, time: '11:15 AM', date: 'Today' },
    { id: 3, title: 'Hostel Mess', category: 'Canteen', amount: -150, time: '8:00 AM', date: 'Today' },
    { id: 4, title: 'Movie Tickets', category: 'Outings', amount: -600, time: '7:30 PM', date: 'Yesterday' },
    { id: 5, title: 'Stationery', category: 'Misc', amount: -120, time: '3:45 PM', date: 'Yesterday' }
  ]);

  const [expenseCategories, setExpenseCategories] = React.useState<ExpenseCategory[]>([
    { category: 'Canteen', amount: 1200, percentage: 37, color: 'bg-orange-500', icon: <Coffee className="h-5 w-5" /> },
    { category: 'Rent', amount: 800, percentage: 25, color: 'bg-blue-500', icon: <Home className="h-5 w-5" /> },
    { category: 'Outings', amount: 750, percentage: 23, color: 'bg-purple-500', icon: <Car className="h-5 w-5" /> },
    { category: 'Misc', amount: 500, percentage: 15, color: 'bg-green-500', icon: <ShoppingBag className="h-5 w-5" /> }
  ]);

  const [showAddCategory, setShowAddCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    icon: '📝'
  });

  const categoryIcons = [
    '🍕', '🚗', '📚', '🎬', '👕', '💊', '🏠', '⚡', '📱', '🎮', '🏋️', '✈️'
  ];

  // Listen for new transactions from Dashboard
  React.useEffect(() => {
    const handleAddTransaction = (event: CustomEvent) => {
      const { title, amount, category } = event.detail;
      const newTransaction: Transaction = {
        id: Date.now(),
        title,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: -parseInt(amount),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        date: 'Today'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update expense categories
      setExpenseCategories(prev => {
        const categoryName = newTransaction.category;
        const existingCategoryIndex = prev.findIndex(cat => cat.category === categoryName);
        
        if (existingCategoryIndex >= 0) {
          const updated = [...prev];
          updated[existingCategoryIndex].amount += Math.abs(newTransaction.amount);
          return updated;
        } else {
          // Add new category if it doesn't exist
          const colors = ['bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return [...prev, {
            category: categoryName,
            amount: Math.abs(newTransaction.amount),
            percentage: 0, // Will be recalculated
            color: randomColor,
            icon: <MoreHorizontal className="h-5 w-5" />
          }];
        }
      });
    };

    window.addEventListener('addTransaction', handleAddTransaction as EventListener);
    return () => window.removeEventListener('addTransaction', handleAddTransaction as EventListener);
  }, []);

  // Recalculate percentages when categories change
  React.useEffect(() => {
    const total = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
    if (total > 0) {
      setExpenseCategories(prev => 
        prev.map(cat => ({
          ...cat,
          percentage: Math.round((cat.amount / total) * 100)
        }))
      );
    }
  }, [expenseCategories.map(cat => cat.amount).join(',')]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;

    const colors = ['bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newCat: ExpenseCategory = {
      category: newCategory.name,
      amount: 0,
      percentage: 0,
      color: randomColor,
      icon: <span className="text-lg">{newCategory.icon}</span>
    };

    setExpenseCategories(prev => [...prev, newCat]);
    setNewCategory({ name: '', icon: '📝' });
    setShowAddCategory(false);
  };

  const expenseData = [
    { category: 'Canteen', amount: 1200, percentage: 37, color: 'bg-orange-500', icon: <Coffee className="h-5 w-5" /> },
    { category: 'Rent', amount: 800, percentage: 25, color: 'bg-blue-500', icon: <Home className="h-5 w-5" /> },
    { category: 'Outings', amount: 750, percentage: 23, color: 'bg-purple-500', icon: <Car className="h-5 w-5" /> },
    { category: 'Misc', amount: 500, percentage: 15, color: 'bg-green-500', icon: <ShoppingBag className="h-5 w-5" /> }
  ];

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.date]) {
      acc[transaction.date] = [];
    }
    acc[transaction.date].push(transaction);
    return acc;
  }, {} as Record<string, typeof transactions>);

  return (
    <div className="space-y-6">
      {/* Expense Breakdown Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">This Month's Breakdown</h3>
          <button
            onClick={() => setShowAddCategory(true)}
            className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        {/* Pie Chart Representation */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              {expenseCategories.map((item, index) => {
                const offset = expenseCategories.slice(0, index).reduce((sum, prev) => sum + prev.percentage, 0);
                const circumference = 2 * Math.PI * 40;
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((offset / 100) * circumference);
                
                return (
                  <circle
                    key={item.category}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color.replace('bg-', '').replace('-500', '')}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className={item.color.replace('bg-', 'stroke-')}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">₹{expenseCategories.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {expenseCategories.map((item) => (
            <div key={item.category} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="text-sm text-gray-500">₹{item.amount} ({item.percentage}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Category</h3>
              <button 
                onClick={() => setShowAddCategory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="e.g., Gym, Books, Medicine"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {categoryIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewCategory({...newCategory, icon})}
                      className={`p-3 text-xl border-2 rounded-lg hover:border-green-300 transition-colors ${
                        newCategory.icon === icon ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date}>
              <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                {date}
              </div>
              <div className="space-y-2">
                {dayTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-lg">
                          {transaction.category === 'Canteen' ? '🍕' : 
                           transaction.category === 'Transport' ? '🚇' :
                           transaction.category === 'Outings' ? '🎬' : '📚'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.title}</div>
                        <div className="text-sm text-gray-500">{transaction.category} • {transaction.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">₹{Math.abs(transaction.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;