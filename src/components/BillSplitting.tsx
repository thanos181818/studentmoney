import React, { useState } from 'react';
import { Plus, Users, ArrowUpRight, ArrowDownLeft, Send } from 'lucide-react';

const BillSplitting: React.FC = () => {
  const [showAddFriends, setShowAddFriends] = useState(false);

  const friends = [
    { id: 1, name: 'Priya', avatar: '👩', phone: '+91 98765 43210' },
    { id: 2, name: 'Rahul', avatar: '👨', phone: '+91 87654 32109' },
    { id: 3, name: 'Sneha', avatar: '👩', phone: '+91 76543 21098' },
    { id: 4, name: 'Vikram', avatar: '👨', phone: '+91 65432 10987' }
  ];

  const groupExpenses = [
    {
      id: 1,
      title: 'Pizza Night',
      amount: 600,
      participants: ['Priya', 'Rahul', 'You'],
      date: 'Today',
      splitAmount: 200,
      paidBy: 'You'
    },
    {
      id: 2,
      title: 'Movie Tickets',
      amount: 800,
      participants: ['Sneha', 'Vikram', 'You'],
      date: 'Yesterday',
      splitAmount: 267,
      paidBy: 'Sneha'
    }
  ];

  const settlements = [
    { name: 'Priya', amount: 200, type: 'owes', avatar: '👩' },
    { name: 'Rahul', amount: 150, type: 'owes', avatar: '👨' },
    { name: 'Sneha', amount: 267, type: 'owed', avatar: '👩' }
  ];

  const youOwe = settlements.filter(s => s.type === 'owes').reduce((sum, s) => sum + s.amount, 0);
  const youAreOwed = settlements.filter(s => s.type === 'owed').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowUpRight className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">You Owe</span>
          </div>
          <div className="text-2xl font-bold text-red-600">₹{youOwe}</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowDownLeft className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">You Are Owed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">₹{youAreOwed}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors">
            <Plus className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-indigo-700">Add Expense</span>
          </button>
          
          <button 
            onClick={() => setShowAddFriends(!showAddFriends)}
            className="flex items-center justify-center space-x-2 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <Users className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-700">Add Friends</span>
          </button>
        </div>
      </div>

      {/* Friends List (Expandable) */}
      {showAddFriends && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Squad</h3>
          <div className="grid grid-cols-2 gap-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-lg">{friend.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{friend.name}</div>
                  <div className="text-xs text-gray-500">{friend.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Group Expenses */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Group Expenses</h3>
        
        <div className="space-y-3">
          {groupExpenses.map((expense) => (
            <div key={expense.id} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-gray-900">{expense.title}</div>
                  <div className="text-sm text-gray-500">
                    {expense.participants.join(', ')} • {expense.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">₹{expense.amount}</div>
                  <div className="text-sm text-gray-500">₹{expense.splitAmount} each</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Paid by {expense.paidBy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settle Up</h3>
        
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-lg">{settlement.avatar}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{settlement.name}</div>
                  <div className="text-sm text-gray-500">
                    {settlement.type === 'owes' ? 'You owe' : 'Owes you'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`font-semibold ${
                  settlement.type === 'owes' ? 'text-red-600' : 'text-green-600'
                }`}>
                  ₹{settlement.amount}
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                  <Send className="h-4 w-4" />
                  <span>Pay</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillSplitting;