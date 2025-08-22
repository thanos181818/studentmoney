import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  Users
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-green-600" />,
      title: "Email Us",
      details: "hello@paisapal.com",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: "Call Us",
      details: "+91 98765 43210",
      description: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-600" />,
      title: "Visit Us",
      details: "Bangalore, Karnataka",
      description: "Our headquarters"
    },
    {
      icon: <Clock className="h-6 w-6 text-green-600" />,
      title: "Support Hours",
      details: "9:00 AM - 6:00 PM",
      description: "Monday to Friday"
    }
  ];

  const supportOptions = [
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat"
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-green-600" />,
      title: "Help Center",
      description: "Browse our comprehensive FAQ and guides",
      action: "Visit Help Center"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community",
      description: "Connect with other students and share tips",
      action: "Join Community"
    }
  ];

  const faqs = [
    {
      question: "Is BudgetBuddy really free for students?",
      answer: "Yes! BudgetBuddy is completely free for verified students. We believe financial tools should be accessible to everyone."
    },
    {
      question: "How secure is my financial data?",
      answer: "We use bank-level 256-bit encryption and never store your banking credentials. Your data is protected with the highest security standards."
    },
    {
      question: "Can I connect multiple bank accounts?",
      answer: "Absolutely! You can connect multiple bank accounts, credit cards, and digital wallets to get a complete view of your finances."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide customer support via email, live chat, and phone during business hours. We typically respond within 24 hours."
    }
  ];

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in{' '}
            <span className="text-green-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about BudgetBuddy? Need help getting started? 
            We're here to help you on your financial journey.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-lg font-medium text-gray-800 mb-1">
                  {info.details}
                </p>
                <p className="text-sm text-gray-600">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Options */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
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
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
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
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Support Options */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Other Ways to Get Help
              </h2>
              <div className="space-y-6">
                {supportOptions.map((option, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {option.icon}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {option.description}
                        </p>
                        <button className="text-green-600 hover:text-green-700 font-medium">
                          {option.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-xl text-green-200 mb-8">
            Don't wait - take control of your finances today
          </p>
          <button 
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'o', ctrlKey: true });
              window.dispatchEvent(event);
            }}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;