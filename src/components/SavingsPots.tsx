import React, { useState } from 'react';
import { Plus, Target, Plane, Smartphone, Shield, X } from 'lucide-react';

const SavingsPots: React.FC = () => {
  const [savingsGoals, setSavingsGoals] = useState([
    {
      id: 1,
      title: 'Goa Trip',
      target: 15000,
      current: 8500,
      icon: <Plane className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      title: 'New Phone',
      target: 25000,
      current: 12000,
      icon: <Smartphone className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 3,
      title: 'Emergency Fund',
      target: 10000,
      current: 3500,
      icon: <Shield className="h-6 w-6 text-green-600" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ]);

  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    category: 'travel'
  });
  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  const goalCategories = {
    travel: { icon: <Plane className="h-6 w-6 text-blue-600" />, color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    gadget: { icon: <Smartphone className="h-6 w-6 text-purple-600" />, color: 'bg-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    emergency: { icon: <Shield className="h-6 w-6 text-green-600" />, color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    general: { icon: <Target className="h-6 w-6 text-orange-600" />, color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
  };

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target) return;

    const categoryData = goalCategories[newGoal.category as keyof typeof goalCategories];
    const newSavingsGoal = {
      id: Date.now(),
      title: newGoal.title,
      target: parseInt(newGoal.target),
      current: 0,
      ...categoryData
    };

    setSavingsGoals([...savingsGoals, newSavingsGoal]);
    setNewGoal({ title: '', target: '', category: 'travel' });
    setShowNewGoalModal(false);
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMoneyAmount || !selectedGoalId) return;

    const amount = parseInt(addMoneyAmount);
    setSavingsGoals(goals => 
      goals.map(goal => 
        goal.id === selectedGoalId 
          ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
          : goal
      )
    );

    setAddMoneyAmount('');
    setSelectedGoalId(null);
    setShowAddMoneyModal(false);
  };

  const openAddMoneyModal = (goalId: number) => {
    setSelectedGoalId(goalId);
    setShowAddMoneyModal(true);
  };

  // Listen for custom event to trigger new goal modal
  React.useEffect(() => {
    const handleAddSavingsGoal = () => {
      setShowNewGoalModal(true);
    };

    window.addEventListener('addSavingsGoal', handleAddSavingsGoal);
    return () => window.removeEventListener('addSavingsGoal', handleAddSavingsGoal);
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Total Savings</h3>
            <p className="text-green-100">Keep up the great work! 🎉</p>
          </div>
          <Target className="h-8 w-8 text-green-100" />
        </div>
        <div className="text-3xl font-bold mb-2">₹{totalSaved.toLocaleString()}</div>
        <div className="text-green-100">
          {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}% of your total goals
        </div>
      </div>

      {/* Add New Goal Button */}
      <button 
        onClick={() => setShowNewGoalModal(true)}
        className="w-full bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-green-300 hover:bg-green-50 transition-colors"
      >
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Plus className="h-6 w-6" />
          <span className="font-medium">Create New Savings Goal</span>
        </div>
      </button>

      {/* Savings Goals */}
      <div className="space-y-4">
        {savingsGoals.map((goal) => {
          const progress = getProgressPercentage(goal.current, goal.target);
          const isCompleted = progress >= 100;
          
          return (
            <div key={goal.id} className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${goal.borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${goal.bgColor} rounded-full flex items-center justify-center`}>
                    {goal.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    <p className="text-sm text-gray-500">
                      ₹{goal.current.toLocaleString()} of ₹{goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>
                {isCompleted && (
                  <div className="text-2xl">🎉</div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{progress.toFixed(1)}% complete</span>
                  <span>₹{(goal.target - goal.current).toLocaleString()} to go</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${goal.color}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => openAddMoneyModal(goal.id)}
                  disabled={isCompleted}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  {isCompleted ? 'Goal Achieved!' : 'Add Money'}
                </button>
                <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  Edit
                </button>
              </div>

              {/* Achievement Badge */}
              {isCompleted && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="text-green-600">🏆</div>
                    <span className="text-green-700 font-medium">Goal Achieved!</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Savings Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">💡 Savings Tip</h4>
        <p className="text-gray-700 text-sm">
          Try the 50-30-20 rule: 50% for needs, 30% for wants, and 20% for savings. 
          Even saving ₹100 daily can help you reach your goals faster!
        </p>
      </div>

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Goal</h3>
              <button 
                onClick={() => setShowNewGoalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="e.g., New Laptop, Trip to Kerala"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  placeholder="e.g., 15000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="travel">Travel & Trips</option>
                  <option value="gadget">Gadgets & Electronics</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="general">General Savings</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && selectedGoalId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add Money</h3>
              <button 
                onClick={() => setShowAddMoneyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {(() => {
              const goal = savingsGoals.find(g => g.id === selectedGoalId);
              return goal ? (
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 ${goal.bgColor} rounded-full flex items-center justify-center`}>
                      {goal.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-500">
                        ₹{goal.current.toLocaleString()} of ₹{goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
            
            <form onSubmit={handleAddMoney} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Add (₹)
                </label>
                <input
                  type="number"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMoneyModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsPots;