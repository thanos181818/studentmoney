import React, { useState } from 'react';
import { 
  CreditCard, 
  PlusCircle, 
  Target, 
  TrendingUp, 
  Wallet, 
  Home, 
  ShoppingCart, 
  Car, 
  Coffee,
  X,
  Plus
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState<string | null>(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 1200,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      type: 'income'
    },
    {
      id: '2',
      amount: 45,
      category: 'Food',
      description: 'Lunch at cafeteria',
      date: '2024-01-02',
      type: 'expense'
    },
    {
      id: '3',
      amount: 25,
      category: 'Transport',
      description: 'Bus fare',
      date: '2024-01-02',
      type: 'expense'
    },
    {
      id: '4',
      amount: 80,
      category: 'Entertainment',
      description: 'Movie tickets',
      date: '2024-01-03',
      type: 'expense'
    }
  ]);

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      target: 5000,
      current: 1200,
      category: 'Safety'
    },
    {
      id: '2',
      name: 'New Laptop',
      target: 1500,
      current: 450,
      category: 'Technology'
    },
    {
      id: '3',
      name: 'Vacation',
      target: 2000,
      current: 300,
      category: 'Travel'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: 'Food',
    description: '',
    type: 'expense' as 'expense' | 'income'
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    category: 'Personal'
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = () => {
    if (newTransaction.amount && newTransaction.description) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        date: new Date().toISOString().split('T')[0],
        type: newTransaction.type
      };

      setTransactions([transaction, ...transactions]);
      setNewTransaction({
        amount: '',
        category: 'Food',
        description: '',
        type: 'expense'
      });
      setShowAddTransaction(false);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target) {
      const goal: SavingsGoal = {
        id: Date.now().toString(),
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: 0,
        category: newGoal.category
      };

      setSavingsGoals([...savingsGoals, goal]);
      setNewGoal({
        name: '',
        target: '',
        category: 'Personal'
      });
      setShowAddGoal(false);
    }
  };

  const handleAddMoneyToGoal = (goalId: string) => {
    const amount = parseFloat(addMoneyAmount);
    const goal = savingsGoals.find(g => g.id === goalId);
    
    if (amount > 0 && goal) {
      const maxAmount = Math.min(balance, goal.target - goal.current);
      const actualAmount = Math.min(amount, maxAmount);
      
      if (actualAmount > 0) {
        setSavingsGoals(savingsGoals.map(g => 
          g.id === goalId 
            ? { ...g, current: g.current + actualAmount }
            : g
        ));
        
        // Add transaction for the savings
        const savingsTransaction: Transaction = {
          id: Date.now().toString(),
          amount: actualAmount,
          category: 'Savings',
          description: `Added to ${goal.name}`,
          date: new Date().toISOString().split('T')[0],
          type: 'expense'
        };
        
        setTransactions([savingsTransaction, ...transactions]);
      }
    }
    
    setAddMoneyAmount('');
    setShowAddMoney(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return <Coffee className="w-4 h-4" />;
      case 'transport': return <Car className="w-4 h-4" />;
      case 'shopping': return <ShoppingCart className="w-4 h-4" />;
      case 'salary': return <Wallet className="w-4 h-4" />;
      case 'savings': return <Target className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Income</p>
              <p className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Balance</p>
              <p className="text-2xl font-bold">₹{balance.toLocaleString()}</p>
            </div>
            <Wallet className="w-8 h-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
        
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">All Transactions</h2>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className={`text-lg font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSavingsGoals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Savings Goals</h2>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const maxAddAmount = Math.min(balance, remaining);
          
          return (
            <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>₹{goal.current.toLocaleString()}</span>
                    <span>₹{goal.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% complete</p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Remaining: ₹{remaining.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{goal.category}</p>
                </div>
                
                {remaining > 0 && maxAddAmount > 0 && (
                  <button
                    onClick={() => setShowAddMoney(goal.id)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Add Money
                  </button>
                )}
                
                {remaining <= 0 && (
                  <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center text-sm font-medium">
                    Goal Completed! 🎉
                  </div>
                )}
                
                {maxAddAmount <= 0 && remaining > 0 && (
                  <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-center text-sm">
                    Insufficient Balance
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">PaisaPal</h1>
            </div>
            <div className="text-sm text-gray-600">
              Balance: <span className="font-semibold text-blue-600">₹{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
              { id: 'savings', label: 'Savings Goals', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'savings' && renderSavingsGoals()}
      </main>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Transaction</h3>
              <button
                onClick={() => setShowAddTransaction(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'expense' | 'income'})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Salary">Salary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddTransaction(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Savings Goal</h3>
              <button
                onClick={() => setShowAddGoal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter goal name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter target amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Personal">Personal</option>
                  <option value="Technology">Technology</option>
                  <option value="Travel">Travel</option>
                  <option value="Safety">Safety</option>
                  <option value="Education">Education</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Money to Goal</h3>
              <button
                onClick={() => setShowAddMoney(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {(() => {
              const goal = savingsGoals.find(g => g.id === showAddMoney);
              const maxAmount = goal ? Math.min(balance, goal.target - goal.current) : 0;
              
              return (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Goal: <span className="font-medium">{goal?.name}</span></p>
                    <p className="text-sm text-gray-600">Available Balance: <span className="font-medium text-green-600">₹{balance.toLocaleString()}</span></p>
                    <p className="text-sm text-gray-600">Remaining to Goal: <span className="font-medium text-blue-600">₹{goal ? (goal.target - goal.current).toLocaleString() : 0}</span></p>
                    <p className="text-sm text-gray-600">Max you can add: <span className="font-medium text-orange-600">₹{maxAmount.toLocaleString()}</span></p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Add</label>
                    <input
                      type="number"
                      value={addMoneyAmount}
                      onChange={(e) => setAddMoneyAmount(e.target.value)}
                      max={maxAmount}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter amount (max ₹${maxAmount})`}
                    />
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAddMoney(null)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddMoneyToGoal(showAddMoney)}
                      disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0 || parseFloat(addMoneyAmount) > maxAmount}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;