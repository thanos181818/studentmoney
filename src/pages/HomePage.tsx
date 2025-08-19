import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  PieChart, 
  Target,
  ArrowRight,
  Star,
  CheckCircle,
  Users,
  Zap,
  Gift
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <PieChart className="h-12 w-12 text-indigo-600" />,
      title: "Smart Expense Tracking",
      description: "Automatically categorize canteen, rent, and outing expenses with AI"
    },
    {
      icon: <Users className="h-12 w-12 text-purple-600" />,
      title: "Bill Splitting Made Easy",
      description: "Split hostel bills, pizza orders, and movie tickets with your squad"
    },
    {
      icon: <Target className="h-12 w-12 text-green-600" />,
      title: "Savings Pots",
      description: "Save for Goa trips, new phones, and emergency funds with visual goals"
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-600" />,
      title: "UPI Integration",
      description: "Connect GPay, PhonePe, Paytm for seamless expense tracking"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Engineering Student, IIT Delhi",
      content: "Finally tracked where my pocket money goes! Saved ₹8,000 for my Goa trip using PaisaPal's savings pots.",
      rating: 5,
      avatar: "👩‍🎓"
    },
    {
      name: "Rahul Gupta",
      role: "MBA Student, IIM Bangalore",
      content: "Bill splitting with roommates is so easy now. No more awkward money conversations!",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Ananya Patel",
      role: "Medical Student, AIIMS",
      content: "Love how it understands student expenses - from canteen food to late-night Swiggy orders!",
      rating: 5,
      avatar: "👩‍⚕️"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Smart Money for{' '}
                <span className="text-indigo-600">Smart Students</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Track expenses, split hostel bills, and save smarter — all in one app designed for Indian college life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center">
                  Get Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <Link 
                  to="/features"
                  className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center"
                >
                  See How It Works
                </Link>
              </div>
            </div>
            
            {/* Mobile App Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 shadow-2xl">
                  <div className="bg-white rounded-2xl h-full p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-gray-900">Hey Arjun! 👋</div>
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">🎓</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl mb-4">
                      <div className="text-sm opacity-90 mb-1">Monthly Balance</div>
                      <div className="text-2xl font-bold">₹8,450</div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">🍕</span>
                          <div>
                            <div className="font-medium text-sm">Dominos Pizza</div>
                            <div className="text-xs text-gray-500">Canteen</div>
                          </div>
                        </div>
                        <div className="text-red-600 font-semibold text-sm">-₹450</div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">🎬</span>
                          <div>
                            <div className="font-medium text-sm">Movie Tickets</div>
                            <div className="text-xs text-gray-500">Split with 3 friends</div>
                          </div>
                        </div>
                        <div className="text-red-600 font-semibold text-sm">-₹200</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                  <Gift className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-full shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Money Journey in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, smart, and designed for student life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Track</h3>
              <p className="text-gray-600">
                Connect your UPI apps and automatically track every canteen meal, 
                metro ride, and late-night food order
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Save</h3>
              <p className="text-gray-600">
                Create fun savings goals for your Goa trip, new phone, or emergency fund. 
                Watch your money grow with visual progress
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Grow</h3>
              <p className="text-gray-600">
                Build healthy money habits, split bills with friends seamlessly, 
                and graduate with financial confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Indian Student Life
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From hostel mess bills to weekend movie plans - we get it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {feature.icon}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Students Across India
            </h2>
            <p className="text-indigo-200 text-lg">
              Join thousands of students building better money habits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">25K+</div>
              <div className="text-indigo-200">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">₹50L+</div>
              <div className="text-indigo-200">Bills Split</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-indigo-200">Colleges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.8★</div>
              <div className="text-indigo-200">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Stories from Real Students
            </h2>
            <p className="text-xl text-gray-600">
              See how PaisaPal is changing student financial habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm">
                    <span className="text-xl">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-6xl">🚀</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Master Your Money?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the waitlist and be among the first students to experience PaisaPal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center">
              Get Early Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
              Watch Demo
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            🎓 Free for all verified students • 🔒 Bank-level security • 📱 Available on iOS & Android
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;