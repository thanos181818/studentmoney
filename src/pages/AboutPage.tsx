import React from 'react';
import { 
  Users, 
  Target, 
  Heart, 
  Award,
  Lightbulb,
  Shield,
  TrendingUp,
  Globe
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-green-500" />,
      title: "Student-First",
      description: "Everything we build is designed with students' unique financial needs in mind"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Trust & Security",
      description: "Your financial data is protected with the highest security standards"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-green-500" />,
      title: "Innovation",
      description: "We continuously innovate to provide the best financial tools for students"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Community",
      description: "Building a supportive community of financially savvy students"
    }
  ];

  const team = [
    {
      name: "Arjun Mehta",
      role: "Co-Founder & CEO",
      description: "Former Goldman Sachs analyst with a passion for student financial wellness",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Sneha Patel",
      role: "Co-Founder & CTO",
      description: "Ex-Google engineer specializing in fintech and mobile applications",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Vikram Singh",
      role: "Head of Product",
      description: "Product leader with 8+ years in consumer fintech and student services",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Priya Sharma",
      role: "Head of Design",
      description: "UX designer focused on creating intuitive financial experiences",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Founded",
      description: "PaisaPal was founded by two IIT graduates who struggled with financial management during college"
    },
    {
      year: "2023",
      title: "Beta Launch",
      description: "Launched beta version with 1,000 students across 10 universities"
    },
    {
      year: "2023",
      title: "Seed Funding",
      description: "Raised ₹5 crores in seed funding from leading VCs and angel investors"
    },
    {
      year: "2024",
      title: "50K Users",
      description: "Reached 50,000+ active users across 200+ colleges in India"
    }
  ];

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About{' '}
            <span className="text-green-600">PaisaPal</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're on a mission to empower every student with the financial tools and knowledge 
            they need to build a secure and prosperous future.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Financial literacy and management shouldn't be a privilege. Every student deserves 
                access to tools that help them understand, track, and optimize their finances.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that by starting early with good financial habits, students can avoid 
                debt traps, build emergency funds, and set themselves up for long-term financial success.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Target className="h-6 w-6 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-900">Goal-Oriented</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-900">Growth-Focused</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                  <div className="text-gray-600">Students Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">₹2Cr+</div>
                  <div className="text-gray-600">Money Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
                  <div className="text-gray-600">Colleges</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">4.9★</div>
                  <div className="text-gray-600">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Passionate individuals working to transform student finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-3">
                  <p className="text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to help students
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-green-200 mb-8">
            Be part of the movement to make financial wellness accessible to every student
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'o', ctrlKey: true });
                window.dispatchEvent(event);
              }}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Join Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;