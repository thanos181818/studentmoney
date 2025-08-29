import React from 'react';
import { Coffee, Home, Car, ShoppingBag, MoreHorizontal, Plus, X } from 'lucide-react';
import { expensesAPI, getAuthToken } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  time: string;
  date: string;
  created_at?: string;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

const ExpenseTracker: React.FC = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Define category mappings with consistent colors and icons
  const categoryMappings = {
    'Canteen': { 
      color: 'bg-orange-500', 
      strokeColor: '#f97316',
      icon: <Coffee className="h-5 w-5" />, 
      emoji: '🍕' 
    },
    'Transport': { 
      color: 'bg-blue-500', 
      strokeColor: '#3b82f6',
      icon: <Car className="h-5 w-5" />, 
      emoji: '🚇' 
    },
    'Outings': { 
      color: 'bg-purple-500', 
      strokeColor: '#a855f7',
      icon: <Car className="h-5 w-5" />, 
      emoji: '🎬' 
    },
    'Misc': { 
      color: 'bg-green-500', 
      strokeColor: '#22c55e',
      icon: <ShoppingBag className="h-5 w-5" />, 
      emoji: '📚' 
    },
    'Rent': { 
      color: 'bg-indigo-500', 
      strokeColor: '#6366f1',
      icon: <Home className="h-5 w-5" />, 
      emoji: '🏠' 
    },
    'Books': { 
      color: 'bg-yellow-500', 
      strokeColor: '#eab308',
      icon: <ShoppingBag className="h-5 w-5" />, 
      emoji: '📚' 
    },
    'Gym': { 
      color: 'bg-red-500', 
      strokeColor: '#ef4444',
      icon: <MoreHorizontal className="h-5 w-5" />, 
      emoji: '🏋️' 
    },
    'Medicine': { 
      color: 'bg-pink-500', 
      strokeColor: '#ec4899',
      icon: <MoreHorizontal className="h-5 w-5" />, 
      emoji: '💊' 
    }
  };

  const [expenseCategories, setExpenseCategories] = React.useState<ExpenseCategory[]>([]);
  const [showAddCategory, setShowAddCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    icon: '📝'
  });

  const categoryIcons = [
    '🍕', '🚗', '📚', '🎬', '👕', '💊', '🏠', '⚡', '📱', '🎮', '🏋️', '✈️'
  ];

  // Load expenses from backend
  React.useEffect(() => {
    const loadExpenses = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const data = await expensesAPI.getExpenses(token);
          
          // Transform backend data to frontend format
          const transformedTransactions = data.expenses.map((expense: any) => {
            const createdAt = new Date(expense.created_at);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let dateLabel = 'Today';
            if (createdAt.toDateString() === yesterday.toDateString()) {
              dateLabel = 'Yesterday';
            } else if (createdAt.toDateString() !== today.toDateString()) {
              dateLabel = createdAt.toLocaleDateString();
            }
            
            return {
              id: expense.id,
              title: expense.title,
              category: expense.category,
              amount: -expense.amount, // Negative for expenses
              time: createdAt.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              date: dateLabel,
              created_at: expense.created_at
            };
          });
          
          setTransactions(transformedTransactions);
        }
      } catch (error) {
        console.error('Failed to load expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, []);

  // Load expense categories from backend
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const data = await expensesAPI.getCategories(token);
          
          // Transform backend data to frontend format
          const transformedCategories = data.categories.map((cat: any) => {
            const categoryMapping = categoryMappings[cat.category as keyof typeof categoryMappings];
            return {
              category: cat.category,
              amount: cat.amount,
              percentage: cat.percentage,
              color: categoryMapping?.color || 'bg-gray-500',
              icon: categoryMapping?.icon || <MoreHorizontal className="h-5 w-5" />
            };
          });
          
          setExpenseCategories(transformedCategories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    if (transactions.length > 0) {
      loadCategories();
    }
  }, [transactions]);

  // Listen for refresh events from Dashboard
  React.useEffect(() => {
    const handleRefreshExpenses = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const data = await expensesAPI.getExpenses(token);
          
          // Transform backend data to frontend format
          const transformedTransactions = data.expenses.map((expense: any) => {
            const createdAt = new Date(expense.created_at);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let dateLabel = 'Today';
            if (createdAt.toDateString() === yesterday.toDateString()) {
              dateLabel = 'Yesterday';
            } else if (createdAt.toDateString() !== today.toDateString()) {
              dateLabel = createdAt.toLocaleDateString();
            }
            
            return {
              id: expense.id,
              title: expense.title,
              category: expense.category,
              amount: -expense.amount,
              time: createdAt.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              date: dateLabel,
              created_at: expense.created_at
            };
          });
          
          setTransactions(transformedTransactions);
        }
      } catch (error) {
        console.error('Failed to refresh expenses:', error);
      }
    };

    window.addEventListener('refreshExpenses', handleRefreshExpenses);
    return () => window.removeEventListener('refreshExpenses', handleRefreshExpenses);
  }, []);


  // Recalculate total for display
  const totalExpenseAmount = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;

    const categoryMapping = categoryMappings[newCategory.name as keyof typeof categoryMappings];
    const color = categoryMapping?.color || 'bg-gray-500';
    const icon = categoryMapping?.icon || <span className="text-lg">{newCategory.icon}</span>;
    
    const newCat: ExpenseCategory = {
      category: newCategory.name,
      amount: 0,
      percentage: 0,
      color: color,
      icon: icon
    };

    setExpenseCategories(prev => [...prev, newCat]);
    setNewCategory({ name: '', icon: '📝' });
    setShowAddCategory(false);
  };

  // Helper function to get category emoji
  const getCategoryEmoji = (category: string) => {
    const mapping = categoryMappings[category as keyof typeof categoryMappings];
    return mapping?.emoji || '📝';
  };

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
                const categoryMapping = categoryMappings[item.category as keyof typeof categoryMappings];
                const strokeColor = categoryMapping?.strokeColor || '#6b7280';
                
                return (
                  <circle
                    key={item.category}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">₹{totalExpenseAmount.toLocaleString()}</div>
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
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📝</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h4>
            <p className="text-gray-500">Add your first expense to get started!</p>
          </div>
        ) : (
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
                          <span className="text-lg">{getCategoryEmoji(transaction.category)}</span>
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
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;