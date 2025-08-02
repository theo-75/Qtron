import React from 'react';
import { Activity, Users, Clock, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Star, Building, Heart, Banknote, FileText } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Optimization',
      description: 'Smart algorithms automatically optimize queue flow and reduce wait times by up to 40%'
    },
    {
      icon: Users,
      title: 'Multi-Priority Management',
      description: 'Handle urgent, VIP, elderly, and regular customers with intelligent priority routing'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Comprehensive dashboards with live metrics, performance insights, and predictive analytics'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with role-based access control and data encryption'
    },
    {
      icon: Clock,
      title: 'Smart Notifications',
      description: 'Automated SMS and email updates keep customers informed about wait times and status'
    },
    {
      icon: Activity,
      title: 'Staff Optimization',
      description: 'Intelligent staff allocation and performance tracking to maximize efficiency'
    }
  ];

  const industries = [
    {
      icon: Heart,
      name: 'Healthcare',
      description: 'Hospitals, clinics, and medical centers',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Banknote,
      name: 'Banking',
      description: 'Banks, credit unions, and financial services',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Building,
      name: 'Retail',
      description: 'Stores, service centers, and customer support',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FileText,
      name: 'Government',
      description: 'Public services and government offices',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Chief Medical Officer',
      company: 'City General Hospital',
      content: 'Qtron reduced our patient wait times by 45% and improved satisfaction scores dramatically.',
      rating: 5
    },
    {
      name: 'James Rodriguez',
      role: 'Branch Manager',
      company: 'First National Bank',
      content: 'The AI-powered priority system has transformed our customer service experience.',
      rating: 5
    },
    {
      name: 'Lisa Chen',
      role: 'Operations Director',
      company: 'Metro Government Services',
      content: 'Staff efficiency increased by 35% while citizen satisfaction reached all-time highs.',
      rating: 5
    }
  ];

  const stats = [
    { value: '500+', label: 'Organizations Trust Us' },
    { value: '2M+', label: 'Customers Served Daily' },
    { value: '40%', label: 'Average Wait Time Reduction' },
    { value: '99.9%', label: 'System Uptime' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Qtron</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Smart Queue System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onSignIn}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-primary-700 hover:to-teal-700 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Your
              <span className="bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent"> Queue Management</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered queue management system that reduces wait times, optimizes staff allocation, 
              and enhances customer satisfaction across healthcare, banking, retail, and government sectors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary-600 to-teal-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-primary-700 hover:to-teal-700 transition-all flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onSignIn}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:border-primary-600 hover:text-primary-600 transition-all"
              >
                Sign In to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Organizations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create exceptional customer experiences and optimize operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted Across Industries
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tailored solutions for every sector
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${industry.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <industry.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{industry.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real results from real organizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  <div className="text-sm text-primary-600 dark:text-primary-400">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations already using Qtron to deliver exceptional customer experiences
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onGetStarted}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-all flex items-center space-x-2"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onSignIn}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-primary-600 transition-all"
            >
              Access Your Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Qtron</h3>
                  <p className="text-sm text-gray-400">Smart Queue System</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered queue management for the modern world.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Healthcare</li>
                <li>Banking</li>
                <li>Retail</li>
                <li>Government</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Help Center</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>qtron@gmail.com</p>
                <p>+233 599 656 732</p>
                <p>KNUST Campus, Kumasi, Ghana</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Qtron AI Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;