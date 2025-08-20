import React, { useState } from 'react';
import { Plus, Users, ArrowUpRight, ArrowDownLeft, Send, X, Calculator } from 'lucide-react';

const BillSplitting: React.FC = () => {
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{name: string, amount: number, avatar: string} | null>(null);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    participants: [] as string[]
  });

  const friends = [
    { id: 1, name: 'Priya', avatar: '👩', phone: '+91 98765 43210' },
    { id: 2, name: 'Rahul', avatar: '👨', phone: '+91 87654 32109' },
    { id: 3, name: 'Sneha', avatar: '👩', phone: '+91 76543 21098' },
    { id: 4, name: 'Vikram', avatar: '👨', phone: '+91 65432 10987' }
  ];

  const [groupExpenses, setGroupExpenses] = useState([
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
  ]);

  const [settlements, setSettlements] = useState([
    { name: 'Priya', amount: 200, type: 'owes', avatar: '👩' },
    { name: 'Rahul', amount: 150, type: 'owes', avatar: '👨' },
    { name: 'Sneha', amount: 267, type: 'owed', avatar: '👩' }
  ]);

  const youOwe = settlements.filter(s => s.type === 'owes').reduce((sum, s) => sum + s.amount, 0);
  const youAreOwed = settlements.filter(s => s.type === 'owed').reduce((sum, s) => sum + s.amount, 0);

  const handlePayment = (settlement: {name: string, amount: number, avatar: string}) => {
    setSelectedPayment(settlement);
    const settlementData = settlements.find(s => s.name === settlement.name);
    if (settlementData?.type === 'owed') {
      setShowRequestModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const processPayment = () => {
    if (!selectedPayment) return;
    
    // Notify Dashboard about payment received (increases balance)
    const event = new CustomEvent('paymentMade', {
      detail: { amount: selectedPayment.amount }
    });
    window.dispatchEvent(event);
    
    // Remove the settlement from the list
    setSettlements(prev => prev.filter(s => s.name !== selectedPayment.name));
    
    // Show success message
    const settlementData = settlements.find(s => s.name === selectedPayment.name);
    if (settlementData?.type === 'owed') {
      alert(`Payment of ₹${selectedPayment.amount} received from ${selectedPayment.name}!`);
    } else {
      alert(`Payment of ₹${selectedPayment.amount} sent to ${selectedPayment.name}!`);
    }
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const processRequest = () => {
    if (!selectedPayment) return;
    
    // Show success message for request
    alert(`Payment request of ₹${selectedPayment.amount} sent to ${selectedPayment.name}!`);
    setShowRequestModal(false);
    setSelectedPayment(null);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount || newExpense.participants.length === 0) return;

    const splitAmount = Math.round(parseInt(newExpense.amount) / newExpense.participants.length);
    
    // Create new expense
    const newExpenseItem = {
      id: Date.now(),
      title: newExpense.title,
      amount: parseInt(newExpense.amount),
      participants: newExpense.participants,
      date: 'Today',
      splitAmount,
      paidBy: 'You'
    };
    
    // Add to group expenses
    setGroupExpenses(prev => [newExpenseItem, ...prev]);
    
    // Update settlements - add amounts for participants who owe you
    const participantsWhoOwe = newExpense.participants.filter(p => p !== 'You');
    if (participantsWhoOwe.length > 0) {
      setSettlements(prev => {
        const updated = [...prev];
        participantsWhoOwe.forEach(participant => {
          const existingIndex = updated.findIndex(s => s.name === participant);
          if (existingIndex >= 0) {
            // If they already owe you, add to the amount
            if (updated[existingIndex].type === 'owed') {
              updated[existingIndex].amount += splitAmount;
            } else {
              // If you owed them, reduce that amount or flip the relationship
              if (updated[existingIndex].amount > splitAmount) {
                updated[existingIndex].amount -= splitAmount;
              } else {
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  amount: splitAmount - updated[existingIndex].amount,
                  type: 'owed'
                };
              }
            }
          } else {
            // Find friend avatar
            const friend = friends.find(f => f.name === participant);
            updated.push({
              name: participant,
              amount: splitAmount,
              type: 'owed',
              avatar: friend?.avatar || '👤'
            });
          }
        });
        return updated;
      });
    }
    
    // Reset form
    setNewExpense({
      title: '',
      amount: '',
      participants: []
    });
    setShowAddExpense(false);
  };

  const toggleParticipant = (friendName: string) => {
    setNewExpense(prev => ({
      ...prev,
      participants: prev.participants.includes(friendName)
        ? prev.participants.filter(name => name !== friendName)
        : [...prev.participants, friendName]
    }));
  };

  // Listen for custom event to trigger add expense modal
  React.useEffect(() => {
    const handleAddGroupExpense = () => {
      setShowAddExpense(true);
    };

    window.addEventListener('addGroupExpense', handleAddGroupExpense);
    return () => window.removeEventListener('addGroupExpense', handleAddGroupExpense);
  }, []);

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
          <button 
            onClick={() => setShowAddExpense(true)}
            className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
          >
            <Plus className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-700">Add Expense</span>
          </button>
          
          <button 
            onClick={() => setShowAddFriends(!showAddFriends)}
            className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
          >
            <Users className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-700">Add Friends</span>
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
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                  <Send className="h-4 w-4" />
                  <span onClick={() => handlePayment(settlement)}>{settlement.type === 'owed' ? 'Request' : 'Pay'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add Group Expense</h3>
              <button 
                onClick={() => setShowAddExpense(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Title
                </label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  placeholder="e.g., Pizza Night, Movie Tickets"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="e.g., 600"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Split with Friends
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    onClick={() => toggleParticipant('You')}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      newExpense.participants.includes('You')
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">👤</span>
                      <span className="font-medium">You</span>
                    </div>
                  </div>
                  {friends.map((friend) => (
                    <div 
                      key={friend.id}
                      onClick={() => toggleParticipant(friend.name)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        newExpense.participants.includes(friend.name)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{friend.avatar}</span>
                        <span className="font-medium text-sm">{friend.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {newExpense.participants.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <Calculator className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        ₹{newExpense.amount ? Math.round(parseInt(newExpense.amount) / newExpense.participants.length) : 0} per person
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newExpense.participants.length === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Send Payment</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{selectedPayment.avatar}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Pay {selectedPayment.name}
              </h4>
              <div className="text-3xl font-bold text-green-600 mb-4">
                ₹{selectedPayment.amount}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors flex items-center">
                <span className="text-2xl mr-3">🟢</span>
                <span className="font-medium">Google Pay</span>
              </button>
              <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors flex items-center">
                <span className="text-2xl mr-3">🟣</span>
                <span className="font-medium">PhonePe</span>
              </button>
              <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors flex items-center">
                <span className="text-2xl mr-3">🔵</span>
                <span className="font-medium">Paytm</span>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
              >
                Send Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Payment Modal */}
      {showRequestModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Request Payment</h3>
              <button 
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{selectedPayment.avatar}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Request from {selectedPayment.name}
              </h4>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ₹{selectedPayment.amount}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors flex items-center">
                <span className="text-2xl mr-3">💬</span>
                <span className="font-medium">Send WhatsApp Message</span>
              </button>
              <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors flex items-center">
                <span className="text-2xl mr-3">📱</span>
                <span className="font-medium">Send SMS</span>
              </button>
              <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors flex items-center">
                <span className="text-2xl mr-3">📧</span>
                <span className="font-medium">Send Email</span>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={processRequest}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillSplitting;