import React, { useState } from 'react';
import { ArrowRight, Check, Users, Gift, Calendar, Plane, Smartphone, CreditCard, Zap } from 'lucide-react';
import { onboardingAPI, getAuthToken } from '../services/api';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const goals = [
    {
      id: 'rent',
      title: 'Save for Rent',
      description: 'Monthly hostel fees',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'gifts',
      title: 'Birthday Gifts',
      description: 'Friends & family',
      icon: <Gift className="h-8 w-8 text-pink-600" />,
      color: 'bg-pink-50 border-pink-200'
    },
    {
      id: 'weekend',
      title: 'Weekend Budget',
      description: 'Movies & outings',
      icon: <Calendar className="h-8 w-8 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200'
    },
    {
      id: 'travel',
      title: 'Travel Fund',
      description: 'Goa trip with squad',
      icon: <Plane className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    }
  ];

  const upiApps = [
    { name: 'Google Pay', icon: '🟢', color: 'bg-green-100' },
    { name: 'PhonePe', icon: '🟣', color: 'bg-emerald-100' },
    { name: 'Paytm', icon: '🔵', color: 'bg-blue-100' },
    { name: 'Bank Account', icon: '🏦', color: 'bg-gray-100' }
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const nextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding data to backend
      setIsLoading(true);
      try {
        const token = getAuthToken();
        if (token) {
          await onboardingAPI.saveOnboardingData(selectedGoals, selectedUpiApp, token);
        }
        onComplete();
      } catch (error) {
        console.error('Failed to save onboarding data:', error);
        // Continue to dashboard even if save fails
        onComplete();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mb-6">
                <div className="text-6xl">🎓💰</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to BudgetBuddy!
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Your smart money companion for college life. Track expenses, split bills, and save like a pro!
            </p>
          </div>
        );

      case 1:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What are your money goals?
            </h2>
            <p className="text-gray-600 mb-8">
              Select what you'd like to save for (you can change these later)
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedGoals.includes(goal.id)
                      ? 'border-green-500 bg-green-50'
                      : goal.color
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {goal.icon}
                    <h3 className="font-semibold text-gray-900 mt-2 text-sm">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {goal.description}
                    </p>
                    {selectedGoals.includes(goal.id) && (
                      <Check className="h-5 w-5 text-green-600 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="mb-6">
              <Smartphone className="h-16 w-16 text-green-600 mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect your UPI
            </h2>
            <p className="text-gray-600 mb-8">
              Link your payment method to track expenses automatically
            </p>
            <div className="space-y-3 max-w-sm mx-auto">
              {upiApps.map((app, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedUpiApp(app.name)}
                  className={`w-full p-4 rounded-xl border-2 transition-colors ${
                    selectedUpiApp === app.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  } ${app.color}`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{app.icon}</span>
                    <span className="font-medium text-gray-900">{app.name}</span>
                    {selectedUpiApp === app.name ? (
                      <Check className="h-5 w-5 text-green-600 ml-auto" />
                    ) : (
                      <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
                <div className="text-4xl">🎉</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              You're all set!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Ready to take control of your money and build awesome saving habits!
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl max-w-sm mx-auto">
              <div className="text-sm text-gray-600 mb-2">Your journey starts with</div>
              <div className="text-2xl font-bold text-green-600">Smart Money Management</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        {/* Progress Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {renderStep()}

        <div className="mt-8 flex justify-center">
          <button
            onClick={nextStep}
            disabled={
              (currentStep === 1 && selectedGoals.length === 0) ||
              (currentStep === 2 && !selectedUpiApp) ||
              isLoading
            }
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center"
          >
            {isLoading ? 'Saving...' : (currentStep === 3 ? 'Start Using BudgetBuddy' : 'Continue')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;