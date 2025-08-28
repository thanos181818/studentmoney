import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthComplete }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (authMode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (authMode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check dummy credentials for login
    if (authMode === 'login') {
      if (formData.email === 'admin123' && formData.password === 'admin123') {
        onAuthComplete();
      } else {
        setErrors({ 
          password: 'Invalid credentials. Use admin123 / admin123 for demo' 
        });
      }
    } else if (authMode === 'signup') {
      // For demo, any valid signup goes to onboarding
      onAuthComplete();
    } else if (authMode === 'forgot') {
      // For demo, show success message
      alert('Password reset link sent to your email!');
      setAuthMode('login');
    }
  };

  const renderForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email or username"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign up
              </button>
            </div>
          </form>
        );

      case 'signup':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" required />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-green-600 hover:text-green-700">Terms of Service</a> and{' '}
                <a href="#" className="text-green-600 hover:text-green-700">Privacy Policy</a>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        );

      case 'forgot':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              Send Reset Link
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <div className="text-center">
              <span className="text-gray-600">Remember your password? </span>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'login':
        return 'Welcome Back!';
      case 'signup':
        return 'Join BudgetBuddy';
      case 'forgot':
        return 'Reset Password';
      default:
        return 'Welcome Back!';
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case 'login':
        return 'Sign in to continue your financial journey';
      case 'signup':
        return 'Create your account to get started';
      case 'forgot':
        return 'Enter your email to reset your password';
      default:
        return 'Sign in to continue your financial journey';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wallet className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">BudgetBuddy</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getTitle()}
          </h1>
          <p className="text-gray-600">
            {getSubtitle()}
          </p>
        </div>

        {/* Demo Credentials Notice */}
        {authMode === 'login' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">Demo Credentials:</div>
              <div>Username: <span className="font-mono">admin123</span></div>
              <div>Password: <span className="font-mono">admin123</span></div>
            </div>
          </div>
        )}

        {renderForm()}

        {/* Social Login Options */}
        {authMode !== 'forgot' && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg mr-2">🟢</span>
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg mr-2">📱</span>
                Phone
              </button>
            </div>
          </div>
        )}

        {/* Student Verification Notice */}
        {authMode === 'signup' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <div className="font-medium mb-1">🎓 Student Verification</div>
              <div>Upload your student ID after signup to unlock all premium features for free!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;