import React from 'react';
import { Plus, Target, Plane, Smartphone, Shield } from 'lucide-react';

const SavingsPots: React.FC = () => {
  const savingsGoals = [
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
  ];

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

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
          {((totalSaved / totalTarget) * 100).toFixed(1)}% of your total goals
        </div>
      </div>

      {/* Add New Goal Button */}
      <button className="w-full bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
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
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">
                  Add Money
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
    </div>
  );
};

export default SavingsPots;