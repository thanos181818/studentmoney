import React, { useState } from 'react';
import { Plus, Target, Plane, Smartphone, Shield, X } from 'lucide-react';
import { savingsAPI, getAuthToken } from '../services/api';

interface SavingsGoal {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  category: string;
  created_at: string;
  updated_at: string;
}

const SavingsPots: React.FC = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    category: 'travel'
  });
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [editGoalData, setEditGoalData] = useState({
    newTarget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goalCategories = {
    travel: { icon: <Plane className="h-6 w-6 text-blue-600" />, color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    gadget: { icon: <Smartphone className="h-6 w-6 text-purple-600" />, color: 'bg-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    emergency: { icon: <Shield className="h-6 w-6 text-green-600" />, color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    general: { icon: <Target className="h-6 w-6 text-orange-600" />, color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
  };

  // Load savings goals from backend
  React.useEffect(() => {
    const loadSavingsGoals = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const data = await savingsAPI.getSavingsGoals(token);
          setSavingsGoals(data.savingsGoals);
        }
      } catch (error) {
        console.error('Failed to load savings goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavingsGoals();
  }, []);

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target_amount, 0);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryData = (category: string) => {
    return goalCategories[category as keyof typeof goalCategories] || goalCategories.general;
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target) return;

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await savingsAPI.createSavingsGoal(
        newGoal.title,
        parseInt(newGoal.target),
        newGoal.category,
        token
      );

      setSavingsGoals(prev => [...prev, response.savingsGoal]);
      setNewGoal({ title: '', target: '', category: 'travel' });
      setShowNewGoalModal(false);
    } catch (error: any) {
      alert(error.message || 'Failed to create savings goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMoneyAmount || !selectedGoalId) return;

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const amount = parseInt(addMoneyAmount);
      const response = await savingsAPI.addMoneyToGoal(selectedGoalId, amount, token);

      // Update local state
      setSavingsGoals(goals => 
        goals.map(goal => 
          goal.id === selectedGoalId 
            ? response.savingsGoal
            : goal
        )
      );

      // Notify Dashboard about savings update
      const event = new CustomEvent('savingsUpdate', {
        detail: { amount: response.amountAdded }
      });
      window.dispatchEvent(event);
      
      setAddMoneyAmount('');
      setSelectedGoalId(null);
      setShowAddMoneyModal(false);
    } catch (error: any) {
      alert(error.message || 'Failed to add money to goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddMoneyModal = (goalId: number) => {
    setSelectedGoalId(goalId);
    setShowAddMoneyModal(true);
  };

  const openEditGoalModal = (goalId: number) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoalId(goalId);
      setEditGoalData({ newTarget: goal.target.toString() });
      setShowEditGoalModal(true);
    }
  };

  const handleEditGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGoalData.newTarget || !selectedGoalId) return;

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const newTarget = parseInt(editGoalData.newTarget);
      const response = await savingsAPI.updateSavingsGoal(selectedGoalId, newTarget, token);

      // Update local state
      setSavingsGoals(goals => 
        goals.map(goal => 
          goal.id === selectedGoalId 
            ? response.savingsGoal
            : goal
        )
      );

      setEditGoalData({ newTarget: '' });
      setSelectedGoalId(null);
      setShowEditGoalModal(false);
    } catch (error: any) {
      alert(error.message || 'Failed to update savings goal');
    } finally {
      setIsSubmitting(false);
    }
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
      {isLoading ? (
        <div className="bg-gray-200 animate-pulse rounded-2xl p-6 h-32"></div>
      ) : (
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
      )}

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
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-2xl p-6 h-32"></div>
            ))}
          </div>
        ) : savingsGoals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No savings goals yet</h4>
            <p className="text-gray-500">Create your first savings goal to get started!</p>
          </div>
        ) : (
          savingsGoals.map((goal) => {
            const progress = getProgressPercentage(goal.current_amount, goal.target_amount);
            const isCompleted = progress >= 100;
            const categoryData = getCategoryData(goal.category);
            
            return (
              <div key={goal.id} className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${categoryData.borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${categoryData.bgColor} rounded-full flex items-center justify-center`}>
                      {categoryData.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-500">
                        ₹{goal.current_amount.toLocaleString()} of ₹{goal.target_amount.toLocaleString()}
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
                    <span>₹{(goal.target_amount - goal.current_amount).toLocaleString()} to go</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${categoryData.color}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => openAddMoneyModal(goal.id)}
                    disabled={isCompleted || isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    {isCompleted ? 'Goal Achieved!' : 'Add Money'}
                  </button>
                  <button 
                    onClick={() => openEditGoalModal(goal.id)}
                    disabled={isSubmitting}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
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
          })
        )}
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
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Goal'}
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
                    <div className={`w-12 h-12 ${getCategoryData(goal.category).bgColor} rounded-full flex items-center justify-center`}>
                      {getCategoryData(goal.category).icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-500">
                        ₹{goal.current_amount.toLocaleString()} of ₹{goal.target_amount.toLocaleString()}
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
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Money'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditGoalModal && selectedGoalId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Savings Goal</h3>
              <button 
                onClick={() => setShowEditGoalModal(false)}
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
                        Current target: ₹{goal.target_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      💡 You can only increase your target amount, not decrease it. This helps maintain your savings momentum!
                    </p>
                  </div>
                </div>
              ) : null;
            })()}
            
            <form onSubmit={handleEditGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={editGoalData.newTarget}
                  onChange={(e) => setEditGoalData({...editGoalData, newTarget: e.target.value})}
                  min={savingsGoals.find(g => g.id === selectedGoalId)?.target_amount || 0}
                  placeholder="Enter new target amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                {(() => {
                  const currentGoal = savingsGoals.find(g => g.id === selectedGoalId);
                  const newTarget = parseInt(editGoalData.newTarget) || 0;
                  const increase = newTarget - (currentGoal?.target_amount || 0);
                  
                  return newTarget > (currentGoal?.target_amount || 0) ? (
                    <p className="text-sm text-green-600 mt-2">
                      ↗️ Increasing target by ₹{increase.toLocaleString()}
                    </p>
                  ) : null;
                })()}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditGoalModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  {isSubmitting ? 'Updating...' : 'Update Goal'}
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