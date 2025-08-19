import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  User, 
  Plus, 
  Trash2, 
  Users, 
  Target, 
  CreditCard, 
  PieChart, 
  TrendingUp,
  Check,
  X,
  Smartphone,
  Home,
  BarChart3,
  Wallet,
  Settings
} from 'lucide-react';

type Screen = 'landing' | 'onboarding' | 'dashboard' | 'addExpense' | 'createSplit' | 'addGoal' | 'profile' | 'notifications';
type OnboardingStep = 'welcome' | 'goals' | 'upi' | 'success';
type DashboardTab = 'expenses' | 'savings' | 'splits';

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
  saved: number;
  emoji: string;
}

interface Split {
  id: string;
  description: string;
  totalAmount: number;
  yourShare: number;
  status: 'pending' | 'settled';
  friends: string[];
}

function App() {
  const [addMoneyGoalId, setAddMoneyGoalId] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('expenses');
  const [balance, setBalance] = useState(15420);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [connectedUPI, setConnectedUPI] = useState<string[]>([]);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 250, category: 'Canteen', description: 'Lunch', date: 'Today', type: 'expense' },
    { id: '2', amount: 80, category: 'Transport', description: 'Auto', date: 'Today', type: 'expense' },
    { id: '3', amount: 1200, category: 'Rent', description: 'Hostel fee', date: 'Yesterday', type: 'expense' },
    { id: '4', amount: 500, category: 'Outings', description: 'Movie', date: 'Yesterday', type: 'expense' },
  ]);

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { id: '1', name: 'Goa Trip', target: 8000, saved: 2400, emoji: '🏖️' },
    { id: '2', name: 'New Phone', target: 25000, saved: 12000, emoji: '📱' },
    { id: '3', name: 'Emergency Fund', target: 10000, saved: 3500, emoji: '🚨' },
  ]);

  const [splits, setSplits] = useState<Split[]>([
    { id: '1', description: 'Pizza Party', totalAmount: 800, yourShare: 200, status: 'pending', friends: ['Rahul', 'Priya', 'Amit'] },
    { id: '2', description: 'Hostel WiFi', totalAmount: 1200, yourShare: 300, status: 'settled', friends: ['Roommates'] },
  ]);

  const goalOptions = [
    { id: 'rent', name: 'Save for Rent', emoji: '🏠' },
    { id: 'gifts', name: 'Birthday Gifts', emoji: '🎁' },
    { id: 'weekend', name: 'Weekend Budget', emoji: '🎉' },
    { id: 'travel', name: 'Travel Fund', emoji: '✈️' },
  ];

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: 'bg-blue-500' },
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-500' },
    { id: 'paytm', name: 'Paytm', color: 'bg-blue-600' },
  ];

  const categories = [
    { id: 'canteen', name: 'Canteen', emoji: '🍽️', color: 'bg-orange-100 text-orange-600' },
    { id: 'transport', name: 'Transport', emoji: '🚗', color: 'bg-blue-100 text-blue-600' },
    { id: 'rent', name: 'Rent', emoji: '🏠', color: 'bg-green-100 text-green-600' },
    { id: 'outings', name: 'Outings', emoji: '🎉', color: 'bg-purple-100 text-purple-600' },
    { id: 'shopping', name: 'Shopping', emoji: '🛍️', color: 'bg-pink-100 text-pink-600' },
    { id: 'misc', name: 'Misc', emoji: '📝', color: 'bg-gray-100 text-gray-600' },
  ];

  const addExpense = () => {
    if (expenseAmount && expenseCategory) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: parseInt(expenseAmount),
        category: expenseCategory,
        description: categories.find(c => c.id === expenseCategory)?.name || 'Expense',
        date: 'Today',
        type: 'expense'
      };
      setTransactions([newTransaction, ...transactions]);
      setBalance(balance - parseInt(expenseAmount));
      setExpenseAmount('');
      setExpenseCategory('');
      setCurrentScreen('dashboard');
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setTransactions(transactions.filter(t => t.id !== id));
      if (transaction.type === 'expense') {
        setBalance(balance + transaction.amount);
      }
    }
  };

  const addToSavings = (goalId: string, amount: number) => {
    setSavingsGoals(savingsGoals.map(goal => 
      goal.id === goalId 
        ? { ...goal, saved: Math.min(goal.saved + amount, goal.target) }
        : goal
    ));
    setBalance(balance - amount);
  };

  const settleSplit = (splitId: string) => {
    setSplits(splits.map(split => 
      split.id === splitId 
        ? { ...split, status: 'settled' as const }
        : split
    ));
  };

  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PaisaPal</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              </nav>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center min-h-screen lg:min-h-0 lg:py-20">
          {/* Left Column - Content */}
          <div className="pt-16 pb-8 lg:pt-0 lg:pb-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Smart Money for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                Smart Students
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Track expenses, split hostel bills, and save smarter — all in one app designed for Indian college students.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setCurrentScreen('onboarding')}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Get Early Access
              </button>
              <button 
                onClick={() => setCurrentScreen('onboarding')}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-green-500 hover:text-green-600 transition-all duration-200"
              >
                Join the Waitlist
              </button>
            </div>

            {/* 3-Step Process */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Track</h3>
                <p className="text-gray-600 text-sm">Monitor your daily expenses and income effortlessly</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Save</h3>
                <p className="text-gray-600 text-sm">Set goals and build healthy saving habits</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Grow</h3>
                <p className="text-gray-600 text-sm">Watch your financial confidence grow over time</p>
              </div>
            </div>
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Mock App Screen */}
                  <div className="bg-gradient-to-br from-green-500 to-blue-500 p-6 text-white">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-2">
                        <Wallet className="w-6 h-6" />
                        <span className="font-bold">PaisaPal</span>
                      </div>
                      <Bell className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-green-100 mb-2">Balance Left</p>
                      <p className="text-3xl font-bold">₹15,420</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span>🍽️</span>
                          </div>
                          <div>
                            <p className="font-medium">Canteen</p>
                            <p className="text-sm text-gray-500">Lunch</p>
                          </div>
                        </div>
                        <p className="font-semibold text-red-500">-₹250</p>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span>🚗</span>
                          </div>
                          <div>
                            <p className="font-medium">Transport</p>
                            <p className="text-sm text-gray-500">Auto</p>
                          </div>
                        </div>
                        <p className="font-semibold text-red-500">-₹80</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-200 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOnboarding = () => {
    const steps = ['welcome', 'goals', 'upi', 'success'];
    const currentStepIndex = steps.indexOf(onboardingStep);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
      <div className="min-h-screen bg-white">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {onboardingStep !== 'welcome' && (
              <button 
                onClick={() => {
                  const prevStep = steps[currentStepIndex - 1] as OnboardingStep;
                  setOnboardingStep(prevStep);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-500">{currentStepIndex + 1}/4</span>
          </div>

          {/* Content */}
          <div className="p-6">
            {onboardingStep === 'welcome' && (
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="text-6xl">👋</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to PaisaPal!</h1>
                <p className="text-gray-600 mb-8">Let's help you manage your money like a pro. We'll set up your account in just a few steps.</p>
                <button 
                  onClick={() => setOnboardingStep('goals')}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold"
                >
                  Get Started
                </button>
              </div>
            )}

            {onboardingStep === 'goals' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">What are your goals?</h1>
                <p className="text-gray-600 mb-8">Select what you want to save for (you can add more later)</p>
                <div className="space-y-4 mb-8">
                  {goalOptions.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => {
                        if (selectedGoals.includes(goal.id)) {
                          setSelectedGoals(selectedGoals.filter(g => g !== goal.id));
                        } else {
                          setSelectedGoals([...selectedGoals, goal.id]);
                        }
                      }}
                      className={`w-full p-4 rounded-xl border-2 flex items-center space-x-4 transition-all ${
                        selectedGoals.includes(goal.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{goal.emoji}</span>
                      <span className="font-medium text-gray-900">{goal.name}</span>
                      {selectedGoals.includes(goal.id) && (
                        <Check className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setOnboardingStep('upi')}
                  disabled={selectedGoals.length === 0}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {onboardingStep === 'upi' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect your UPI apps</h1>
                <p className="text-gray-600 mb-8">We'll help you track transactions from your favorite payment apps</p>
                <div className="space-y-4 mb-8">
                  {upiApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center`}>
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{app.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (connectedUPI.includes(app.id)) {
                            setConnectedUPI(connectedUPI.filter(u => u !== app.id));
                          } else {
                            setConnectedUPI([...connectedUPI, app.id]);
                          }
                        }}
                        className={`w-12 h-6 rounded-full transition-all ${
                          connectedUPI.includes(app.id) ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                          connectedUPI.includes(app.id) ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setOnboardingStep('success')}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold"
                >
                  Continue
                </button>
              </div>
            )}

            {onboardingStep === 'success' && (
              <div className="text-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">You're all set!</h1>
                <p className="text-gray-600 mb-8">Welcome to PaisaPal! Let's start managing your money smartly.</p>
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold"
                >
                  Start Using PaisaPal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="min-h-screen flex">
            {/* Left Side - Progress & Illustration */}
            <div className="w-1/2 bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-center items-center p-12">
              <div className="max-w-md">
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Wallet className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">PaisaPal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Step {currentStepIndex + 1} of 4</p>
                </div>
                
                {/* Illustration based on step */}
                <div className="text-center">
                  {onboardingStep === 'welcome' && (
                    <div className="w-64 h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center">
                      <span className="text-8xl">👋</span>
                    </div>
                  )}
                  {onboardingStep === 'goals' && (
                    <div className="w-64 h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center">
                      <span className="text-8xl">🎯</span>
                    </div>
                  )}
                  {onboardingStep === 'upi' && (
                    <div className="w-64 h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center">
                      <span className="text-8xl">📱</span>
                    </div>
                  )}
                  {onboardingStep === 'success' && (
                    <div className="w-64 h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center">
                      <span className="text-8xl">🎉</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="w-1/2 flex flex-col justify-center p-12">
              <div className="max-w-md mx-auto w-full">
                {onboardingStep !== 'welcome' && (
                  <button 
                    onClick={() => {
                      const prevStep = steps[currentStepIndex - 1] as OnboardingStep;
                      setOnboardingStep(prevStep);
                    }}
                    className="mb-6 p-2 hover:bg-gray-100 rounded-full inline-flex"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                )}

                {onboardingStep === 'welcome' && (
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to PaisaPal!</h1>
                    <p className="text-xl text-gray-600 mb-8">Let's help you manage your money like a pro. We'll set up your account in just a few steps.</p>
                    <button 
                      onClick={() => setOnboardingStep('goals')}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg"
                    >
                      Get Started
                    </button>
                  </div>
                )}

                {onboardingStep === 'goals' && (
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">What are your goals?</h1>
                    <p className="text-xl text-gray-600 mb-8">Select what you want to save for (you can add more later)</p>
                    <div className="space-y-4 mb-8">
                      {goalOptions.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => {
                            if (selectedGoals.includes(goal.id)) {
                              setSelectedGoals(selectedGoals.filter(g => g !== goal.id));
                            } else {
                              setSelectedGoals([...selectedGoals, goal.id]);
                            }
                          }}
                          className={`w-full p-6 rounded-xl border-2 flex items-center space-x-4 transition-all ${
                            selectedGoals.includes(goal.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-3xl">{goal.emoji}</span>
                          <span className="font-medium text-gray-900 text-lg">{goal.name}</span>
                          {selectedGoals.includes(goal.id) && (
                            <Check className="w-6 h-6 text-green-500 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setOnboardingStep('upi')}
                      disabled={selectedGoals.length === 0}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {onboardingStep === 'upi' && (
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect your UPI apps</h1>
                    <p className="text-xl text-gray-600 mb-8">We'll help you track transactions from your favorite payment apps</p>
                    <div className="space-y-4 mb-8">
                      {upiApps.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl">
                          <div className="flex items-center space-x-4">
                            <div className={`w-14 h-14 ${app.color} rounded-xl flex items-center justify-center`}>
                              <Smartphone className="w-7 h-7 text-white" />
                            </div>
                            <span className="font-medium text-gray-900 text-lg">{app.name}</span>
                          </div>
                          <button
                            onClick={() => {
                              if (connectedUPI.includes(app.id)) {
                                setConnectedUPI(connectedUPI.filter(u => u !== app.id));
                              } else {
                                setConnectedUPI([...connectedUPI, app.id]);
                              }
                            }}
                            className={`w-14 h-7 rounded-full transition-all ${
                              connectedUPI.includes(app.id) ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                              connectedUPI.includes(app.id) ? 'translate-x-7' : 'translate-x-0.5'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setOnboardingStep('success')}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {onboardingStep === 'success' && (
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">You're all set!</h1>
                    <p className="text-xl text-gray-600 mb-8">Welcome to PaisaPal! Let's start managing your money smartly.</p>
                    <button 
                      onClick={() => setCurrentScreen('dashboard')}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg"
                    >
                      Start Using PaisaPal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Wallet className="w-6 h-6" />
              <span className="font-bold text-lg">PaisaPal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentScreen('notifications')}
                className="p-2 hover:bg-white/20 rounded-full"
              >
                <Bell className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setCurrentScreen('profile')}
                className="p-2 hover:bg-white/20 rounded-full"
              >
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p className="text-green-100 mb-2">Balance Left</p>
            <p className="text-4xl font-bold">₹{balance.toLocaleString()}</p>
            <p className="text-green-100 text-sm mt-2">This month</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="flex">
            {(['expenses', 'savings', 'splits'] as DashboardTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setDashboardTab(tab)}
                className={`flex-1 py-4 px-6 font-medium capitalize ${
                  dashboardTab === tab
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {dashboardTab === 'expenses' && (
            <div>
              {/* Expense Chart */}
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">This Month</h3>
                  <button className="text-green-600 text-sm font-medium">View All</button>
                </div>
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <PieChart className="w-16 h-16 text-green-600" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-red-500">₹2,030</p>
                    <p className="text-sm text-gray-500">Spent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">₹970</p>
                    <p className="text-sm text-gray-500">Saved</p>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                  <button className="text-green-600 text-sm font-medium">View All</button>
                </div>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          categories.find(c => c.id === transaction.category.toLowerCase())?.color || 'bg-gray-100'
                        }`}>
                          <span>{categories.find(c => c.id === transaction.category.toLowerCase())?.emoji || '📝'}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.category}</p>
                          <p className="text-sm text-gray-500">{transaction.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className={`font-semibold ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                          {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                        </p>
                        <button 
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {dashboardTab === 'savings' && (
            <div className="space-y-4">
              {savingsGoals.map((goal) => (
                <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{goal.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                        <p className="text-sm text-gray-500">₹{goal.saved} / ₹{goal.target}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToSavings(goal.id, 100)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Add ₹100
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(goal.saved / goal.target) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 text-right">{Math.round((goal.saved / goal.target) * 100)}% complete</p>
                </div>
              ))}
              <button 
                onClick={() => setCurrentScreen('addGoal')}
                className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Add New Goal</p>
              </button>
            </div>
          )}

          {dashboardTab === 'splits' && (
            <div className="space-y-4">
              {splits.map((split) => (
                <div key={split.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{split.description}</h3>
                      <p className="text-sm text-gray-500">Total: ₹{split.totalAmount}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      split.status === 'settled' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {split.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-red-500">You owe: ₹{split.yourShare}</p>
                    {split.status === 'pending' && (
                      <button 
                        onClick={() => settleSplit(split.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Settle via UPI
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setCurrentScreen('createSplit')}
                className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Split New Bill</p>
              </button>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setCurrentScreen('addExpense')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="flex">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="flex-1 py-3 px-4 flex flex-col items-center space-y-1"
            >
              <Home className="w-5 h-5 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Home</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('addExpense')}
              className="flex-1 py-3 px-4 flex flex-col items-center space-y-1"
            >
              <Plus className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Add</span>
            </button>
            <button className="flex-1 py-3 px-4 flex flex-col items-center space-y-1">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Stats</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('profile')}
              className="flex-1 py-3 px-4 flex flex-col items-center space-y-1"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PaisaPal</span>
              </div>
              
              {/* Balance Card */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-6 text-center">
                <p className="text-green-100 mb-2">Balance Left</p>
                <p className="text-3xl font-bold">₹{balance.toLocaleString()}</p>
                <p className="text-green-100 text-sm mt-2">This month</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-6">
              <nav className="space-y-2">
                {(['expenses', 'savings', 'splits'] as DashboardTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDashboardTab(tab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium capitalize transition-all ${
                      dashboardTab === tab
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab === 'expenses' && <BarChart3 className="w-5 h-5" />}
                    {tab === 'savings' && <Target className="w-5 h-5" />}
                    {tab === 'splits' && <Users className="w-5 h-5" />}
                    <span>{tab}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-gray-200 space-y-3">
              <button 
                onClick={() => setCurrentScreen('addExpense')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCurrentScreen('notifications')}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentScreen('profile')}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              {dashboardTab === 'expenses' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Expense Tracking</h1>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Expense Chart */}
                    <div className="xl:col-span-1">
                      <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-6">This Month Overview</h3>
                        <div className="w-48 h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <PieChart className="w-24 h-24 text-green-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-3xl font-bold text-red-500">₹2,030</p>
                            <p className="text-sm text-gray-500">Spent</p>
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-green-500">₹970</p>
                            <p className="text-sm text-gray-500">Saved</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="xl:col-span-2">
                      <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-semibold text-gray-900 text-xl">Recent Transactions</h3>
                          <button className="text-green-600 font-medium hover:text-green-700">View All</button>
                        </div>
                        <div className="space-y-4">
                          {transactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all">
                              <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  categories.find(c => c.id === transaction.category.toLowerCase())?.color || 'bg-gray-100'
                                }`}>
                                  <span className="text-lg">{categories.find(c => c.id === transaction.category.toLowerCase())?.emoji || '📝'}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{transaction.category}</p>
                                  <p className="text-sm text-gray-500">{transaction.description} • {transaction.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <p className={`font-semibold text-lg ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                                  {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                                </p>
                                <button 
                                  onClick={() => deleteTransaction(transaction.id)}
                                  className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {dashboardTab === 'savings' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Savings Goals</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savingsGoals.map((goal) => (
                      <div key={goal.id} className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">{goal.emoji}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{goal.name}</h3>
                              <p className="text-sm text-gray-500">₹{goal.saved} / ₹{goal.target}</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(goal.saved / goal.target) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">{Math.round((goal.saved / goal.target) * 100)}% complete</p>
                          <button 
                            onClick={() => addToSavings(goal.id, 100)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
                          >
                            Add ₹100
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setCurrentScreen('addGoal')}
                      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all"
                    >
                      <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium text-lg">Add New Goal</p>
                    </button>
                  </div>
                </div>
              )}

              {dashboardTab === 'splits' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Bill Splits</h1>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {splits.map((split) => (
                      <div key={split.id} className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{split.description}</h3>
                            <p className="text-sm text-gray-500">Total: ₹{split.totalAmount} • {split.friends.join(', ')}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            split.status === 'settled' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {split.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-semibold text-red-500">You owe: ₹{split.yourShare}</p>
                          {split.status === 'pending' && (
                            <button 
                              onClick={() => settleSplit(split.id)}
                              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-all"
                            >
                              Settle via UPI
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setCurrentScreen('createSplit')}
                      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all"
                    >
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium text-lg">Split New Bill</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddExpense = () => (
    <div className="min-h-screen bg-white">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Add Expense</h1>
          <div className="w-10"></div>
        </div>

        {/* Amount Display */}
        <div className="p-6 text-center border-b">
          <p className="text-gray-500 mb-2">Amount</p>
          <p className="text-4xl font-bold text-gray-900">₹{expenseAmount || '0'}</p>
        </div>

        {/* Categories */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setExpenseCategory(category.id)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center space-y-2 transition-all ${
                  expenseCategory === category.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{category.emoji}</span>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Number Keypad */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => setExpenseAmount(expenseAmount + num.toString())}
                className="h-16 bg-gray-100 rounded-xl font-semibold text-xl hover:bg-gray-200 transition-all"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setExpenseAmount(expenseAmount.slice(0, -1))}
              className="h-16 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={() => setExpenseAmount(expenseAmount + '0')}
              className="h-16 bg-gray-100 rounded-xl font-semibold text-xl hover:bg-gray-200 transition-all"
            >
              0
            </button>
            <button
              onClick={() => setExpenseAmount(expenseAmount + '.')}
              className="h-16 bg-gray-100 rounded-xl font-semibold text-xl hover:bg-gray-200 transition-all"
            >
              .
            </button>
          </div>

          <button 
            onClick={addExpense}
            disabled={!expenseAmount || !expenseCategory}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="p-3 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
              <div className="w-12"></div>
            </div>

            {/* Amount Display */}
            <div className="text-center mb-8 p-8 bg-gray-50 rounded-2xl">
              <p className="text-gray-500 mb-2 text-lg">Amount</p>
              <p className="text-6xl font-bold text-gray-900">₹{expenseAmount || '0'}</p>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-6 text-lg">Select Category</h3>
              <div className="grid grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setExpenseCategory(category.id)}
                    className={`p-6 rounded-xl border-2 flex flex-col items-center space-y-3 transition-all ${
                      expenseCategory === category.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{category.emoji}</span>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Number Keypad */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => setExpenseAmount(expenseAmount + num.toString())}
                  className="h-16 bg-gray-100 rounded-xl font-semibold text-xl hover:bg-gray-200 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setExpenseAmount(expenseAmount.slice(0, -1))}
                className="h-16 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={() => setExpenseAmount(expenseAmount + '0')}
                className="h-16 bg-gray-100 rounded-xl font-semibold text-xl hover:bg-gray-200 transition-all"
              >
                0
              </button>
              <button
                onClick={() => setExpenseAmount(expenseAmount + '.')}
                className="h-16 bg-gray-100 rounded-xl font-semibold text-xl hover:bg-gray-200 transition-all"
              >
                .
              </button>
            </div>

            <button 
              onClick={addExpense}
              disabled={!expenseAmount || !expenseCategory}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreateSplit = () => (
    <div className="min-h-screen bg-white">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Split Bill</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input 
                type="text" 
                placeholder="e.g., Pizza party"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
              <input 
                type="number" 
                placeholder="₹0"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Split with</label>
              <div className="space-y-3">
                {['Rahul', 'Priya', 'Amit', 'Sneha'].map((friend) => (
                  <div key={friend} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{friend[0]}</span>
                      </div>
                      <span className="font-medium">{friend}</span>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-green-600" />
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold"
            >
              Create Split
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="p-3 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Split Bill</h1>
              <div className="w-12"></div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Description</label>
                <input 
                  type="text" 
                  placeholder="e.g., Pizza party"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Total Amount</label>
                <input 
                  type="number" 
                  placeholder="₹0"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Split with</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Rahul', 'Priya', 'Amit', 'Sneha'].map((friend) => (
                    <div key={friend} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-lg">{friend[0]}</span>
                        </div>
                        <span className="font-medium text-lg">{friend}</span>
                      </div>
                      <input type="checkbox" className="w-6 h-6 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg"
              >
                Create Split
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddGoal = () => (
    <div className="min-h-screen bg-white">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Add Goal</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
              <input 
                type="text" 
                placeholder="e.g., New Laptop"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
              <input 
                type="number" 
                placeholder="₹0"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose Emoji</label>
              <div className="grid grid-cols-6 gap-4">
                {['💻', '📱', '🎮', '👟', '🎧', '📚', '✈️', '🏖️', '🚗', '🏠', '💍', '🎁'].map((emoji) => (
                  <button
                    key={emoji}
                    className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl hover:bg-green-100 transition-all"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold"
            >
              Create Goal
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="p-3 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Add Savings Goal</h1>
              <div className="w-12"></div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Goal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., New Laptop"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Target Amount</label>
                <input 
                  type="number" 
                  placeholder="₹0"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Choose Emoji</label>
                <div className="grid grid-cols-8 gap-4">
                  {['💻', '📱', '🎮', '👟', '🎧', '📚', '✈️', '🏖️', '🚗', '🏠', '💍', '🎁', '🍕', '🎬', '🏋️', '🎨'].map((emoji) => (
                    <button
                      key={emoji}
                      className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl hover:bg-green-100 transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 mb-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Arjun Sharma</h2>
            <p className="text-gray-500">arjun.sharma@college.edu</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            <button className="w-full bg-white p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Connected Accounts</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
            
            <button className="w-full bg-white p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Notifications</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
            
            <button className="w-full bg-white p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Settings</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
            
            <button 
              onClick={() => setCurrentScreen('landing')}
              className="w-full bg-white p-4 rounded-xl flex items-center justify-between text-red-500"
            >
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="p-3 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <div className="w-12"></div>
            </div>

            {/* Profile Card */}
            <div className="text-center mb-8 p-8 bg-gray-50 rounded-2xl">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">A</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Arjun Sharma</h2>
              <p className="text-gray-500 text-lg">arjun.sharma@college.edu</p>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              <button className="w-full p-6 rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-all">
                <div className="flex items-center space-x-4">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-lg">Connected Accounts</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
              </button>
              
              <button className="w-full p-6 rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-all">
                <div className="flex items-center space-x-4">
                  <Bell className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-lg">Notifications</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
              </button>
              
              <button className="w-full p-6 rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-all">
                <div className="flex items-center space-x-4">
                  <Settings className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-lg">Settings</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
              </button>
              
              <button 
                onClick={() => setCurrentScreen('landing')}
                className="w-full p-6 rounded-xl border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
              >
                <span className="font-medium text-lg">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Notifications</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Goal Achieved!</p>
                <p className="text-sm text-gray-500">You've reached your Emergency Fund goal of ₹10,000</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Split Request</p>
                <p className="text-sm text-gray-500">Rahul added you to "Dinner at Cafe" - ₹320</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border-l-4 border-yellow-500">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Budget Alert</p>
                <p className="text-sm text-gray-500">You've spent 80% of your monthly budget</p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="p-3 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <div className="w-12"></div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl border-l-4 border-green-500 bg-green-50">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">Goal Achieved!</p>
                    <p className="text-gray-600">You've reached your Emergency Fund goal of ₹10,000</p>
                    <p className="text-sm text-gray-400 mt-2">2 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border-l-4 border-blue-500 bg-blue-50">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">Split Request</p>
                    <p className="text-gray-600">Rahul added you to "Dinner at Cafe" - ₹320</p>
                    <p className="text-sm text-gray-400 mt-2">5 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border-l-4 border-yellow-500 bg-yellow-50">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">Budget Alert</p>
                    <p className="text-gray-600">You've spent 80% of your monthly budget</p>
                    <p className="text-sm text-gray-400 mt-2">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {currentScreen === 'landing' && renderLandingPage()}
        {addMoneyGoalId && <AddMoneyModal />}
      {currentScreen === 'onboarding' && renderOnboarding()}
      {currentScreen === 'dashboard' && renderDashboard()}
      {currentScreen === 'addExpense' && renderAddExpense()}
      {currentScreen === 'createSplit' && renderCreateSplit()}
      {currentScreen === 'addGoal' && renderAddGoal()}
      {currentScreen === 'profile' && renderProfile()}
      {currentScreen === 'notifications' && renderNotifications()}
    </div>
  );
}

export default App;