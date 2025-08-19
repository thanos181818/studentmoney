import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  Target, 
  Shield, 
  Smartphone, 
  Bell,
  CreditCard,
  BarChart3,
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const mainFeatures = [
    {
      icon: <PieChart className="h-12 w-12 text-indigo-600" />,
      title: "Smart Budgeting",
      description: "AI-powered budget recommendations based on your spending patterns and student lifestyle",
      features: [
        "Automatic budget creation",
        "Category-wise spending limits",
        "Smart alerts and notifications",
        "Monthly budget optimization"
      ]
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-green-600" />,
      title: "Expense Tracking",
      description: "Effortlessly track and categorize your expenses with intelligent automation",
      features: [
        "Automatic transaction categorization",
        "Receipt scanning and storage",
        "Real-time spending insights",
        "Custom expense categories"
      ]
    },
    {
      icon: <Target className="h-12 w-12 text-purple-600" />,
      title: "Savings Goals",
      description: "Set and achieve financial milestones with personalized saving strategies",
      features: [
        "Multiple savings goals",
        "Progress tracking",
        "Automated savings transfers",
        "Achievement rewards"
      ]
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
      title: "Financial Analytics",
      description: "Comprehensive insights into your financial health and spending patterns",
      features: [
        "Detailed spending reports",
        "Trend analysis",
        "Financial health score",
        "Comparative analytics"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Bank-Level Security",
      description: "Your data is protected with 256-bit encryption and multi-factor authentication"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-green-600" />,
      title: "Mobile First",
      description: "Designed for mobile with offline capabilities and instant sync"
    },
    {
      icon: <Bell className="h-8 w-8 text-yellow-600" />,
      title: "Smart Notifications",
      description: "Get timely alerts about spending limits, bill due dates, and savings opportunities"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      title: "Multi-Account Support",
      description: "Connect multiple bank accounts, credit cards, and digital wallets"
    },
    {
      icon: <Calendar className="h-8 w-8 text-red-600" />,
      title: "Bill Reminders",
      description: "Never miss a payment with intelligent bill tracking and reminders"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Group Expenses",
      description: "Split bills and track shared expenses with friends and roommates"
    }
  ];

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for{' '}
            <span className="text-green-600">Smart Money Management</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the tools and features that make PaisaPal the perfect financial companion for students
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  {feature.icon}
                  <h3 className="text-2xl font-bold text-gray-900 ml-4">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Even More Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for complete financial control
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PaisaPal?
            </h2>
            <p className="text-xl text-gray-600">
              See how we compare to other financial apps
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-green-600">PaisaPal</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500">Other Apps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Student-focused features</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">Limited</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">AI-powered budgeting</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">Basic</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Group expense splitting</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">Not available</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Free for students</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">Paid plans</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience All These Features?
          </h2>
          <p className="text-xl text-green-200 mb-8">
            Start your free account today and take control of your finances
          </p>
          <button 
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'o', ctrlKey: true });
              window.dispatchEvent(event);
            }}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;