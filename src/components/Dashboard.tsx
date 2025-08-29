import React, { useState } from 'react';
import { Plus, TrendingUp, Users, PiggyBank, Eye, EyeOff, Receipt } from 'lucide-react';
import { expensesAPI, getAuthToken } from '../services/api';
import ExpenseTracker from './ExpenseTracker';
import BillSplitting from './BillSplitting';
import SavingsPots from './SavingsPots';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [showBalance, setShowBalance] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [newTransaction, setNewTransaction] = useState({
    title: '',
    amount: '',
    category: 'canteen'
  });

  // Load financial summary on component mount
  React.useEffect(() => {
    const loadSummary = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const summary = await expensesAPI.getSummary(token);
          setMonthlyBalance(summary.monthlyBalance);
          setTotalExpenses(summary.totalExpenses);
          setTotalSavings(summary.totalSavings);
        }
      } catch (error) {
        console.error('Failed to load summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, []);

  const tabs = [
    { id: 'expenses', label: 'Expenses', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'savings', label: 'Savings', icon: <PiggyBank className="h-5 w-5" /> },
    { id: 'splits', label: 'Splits', icon: <Users className="h-5 w-5" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'expenses':
        return <ExpenseTracker />;
      case 'savings':
        return <SavingsPots />;
      case 'splits':
        return <BillSplitting />;
      default:
        return <ExpenseTracker />;
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.title || !newTransaction.amount) return;

    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const transactionAmount = parseInt(newTransaction.amount);
      
      // Add expense to backend
      await expensesAPI.addExpense(
        newTransaction.title,
        transactionAmount,
        newTransaction.category,
        token
      );
      
      // Update local state
      setMonthlyBalance(prev => prev - transactionAmount);
      setTotalExpenses(prev => prev + transactionAmount);
      
      // Dispatch custom event to ExpenseTracker to refresh data
      const event = new CustomEvent('refreshExpenses');
      window.dispatchEvent(event);
      
      // Reset form
      setNewTransaction({
        title: '',
        amount: '',
        category: 'canteen'
      });
      setShowAddTransaction(false);
    } catch (error: any) {
      alert(error.message || 'Failed to add expense');
    }
  };

  // Listen for savings updates from SavingsPots component
  React.useEffect(() => {
    const handleSavingsUpdate = (event: CustomEvent) => {
      const { amount } = event.detail;
      setTotalSavings(prev => prev + amount);
      setMonthlyBalance(prev => prev - amount);
    };

    const handlePaymentReceived = (event: CustomEvent) => {
      const { amount } = event.detail;
      // When you receive money, increase your balance
      setMonthlyBalance(prev => prev + amount);
    };

    const handlePaymentSent = (event: CustomEvent) => {
      const { amount } = event.detail;
      // When you send money, decrease your balance and increase expenses
      setMonthlyBalance(prev => prev - amount);
      setTotalExpenses(prev => prev + amount);
    };

    window.addEventListener('savingsUpdate', handleSavingsUpdate as EventListener);
    window.addEventListener('paymentReceived', handlePaymentReceived as EventListener);
    window.addEventListener('paymentSent', handlePaymentSent as EventListener);
    return () => {
      window.removeEventListener('savingsUpdate', handleSavingsUpdate as EventListener);
      window.removeEventListener('paymentReceived', handlePaymentReceived as EventListener);
      window.removeEventListener('paymentSent', handlePaymentSent as EventListener);
    };
  }, []);
  
  const getFloatingButtonAction = () => {
    switch (activeTab) {
      case 'expenses':
        return () => setShowAddTransaction(true);
      case 'savings':
        return () => {
          // Trigger add savings goal from SavingsPots component
          const event = new CustomEvent('addSavingsGoal');
          window.dispatchEvent(event);
        };
      case 'splits':
        return () => {
          // Trigger add expense from BillSplitting component
          const event = new CustomEvent('addGroupExpense');
          window.dispatchEvent(event);
        };
      default:
        return () => setShowAddTransaction(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hey Arjun! 👋</h1>
            <p className="text-indigo-200">Here's your money overview</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🎓</span>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-indigo-200">Monthly Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-green-200 hover:text-white"
            >
              {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
          <div className="text-3xl font-bold mb-4">
            {isLoading ? '₹••••••' : (showBalance ? `₹${monthlyBalance.toLocaleString()}` : '₹••••••')}
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-green-200">Spent</div>
              <div className="font-semibold">₹{isLoading ? '•••' : totalExpenses.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-green-200">Saved</div>
              <div className="font-semibold">₹{isLoading ? '•••' : totalSavings.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={getFloatingButtonAction()}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add Transaction</h3>
              <button 
                onClick={() => setShowAddTransaction(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newTransaction.title}
                  onChange={(e) => setNewTransaction({...newTransaction, title: e.target.value})}
                  placeholder="e.g., Lunch at canteen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  placeholder="e.g., 150"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="canteen">Canteen</option>
                  <option value="transport">Transport</option>
                  <option value="outings">Outings</option>
                  <option value="misc">Misc</option>
                  <option value="rent">Rent</option>
                  <option value="books">Books</option>
                  <option value="gym">Gym</option>
                  <option value="medicine">Medicine</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;