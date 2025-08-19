import React, { useState } from 'react';
import { Plus, TrendingUp, Users, PiggyBank, Eye, EyeOff } from 'lucide-react';
import ExpenseTracker from './ExpenseTracker';
import BillSplitting from './BillSplitting';
import SavingsPots from './SavingsPots';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [showBalance, setShowBalance] = useState(true);

  const monthlyBalance = 8450;
  const totalExpenses = 3250;
  const totalSavings = 2100;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-b-3xl">
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
              className="text-indigo-200 hover:text-white"
            >
              {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
          <div className="text-3xl font-bold mb-4">
            {showBalance ? `₹${monthlyBalance.toLocaleString()}` : '₹••••••'}
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-indigo-200">Spent</div>
              <div className="font-semibold">₹{totalExpenses.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-indigo-200">Saved</div>
              <div className="font-semibold">₹{totalSavings.toLocaleString()}</div>
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
                    ? 'bg-indigo-600 text-white'
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
      <button className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Dashboard;