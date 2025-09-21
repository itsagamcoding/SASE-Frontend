import React from 'react';
import { Link } from 'react-router-dom';
const Services = () => {
  const services = [
    {
      id: 1,
      icon: '📧',
      title: 'Gmail Automation',
      description: 'Automate your email workflows with intelligent filtering, auto-responses, and smart organization.',
      features: ['Auto-reply & Scheduling', 'Smart Email Filtering', 'Bulk Operations', 'Template Management']
    },
    {
      id: 2,
      icon: '🛒',
      title: 'Flipkart Order Processing',
      description: 'Streamline your e-commerce operations with automated order management and tracking.',
      features: ['Order Status Updates', 'Inventory Sync', 'Customer Notifications', 'Multi-platform Integration']
    },
    {
      id: 3,
      icon: '🎥',
      title: 'YouTube Auto Downloads',
      description: 'Efficiently download and manage YouTube content with automated quality selection and conversion.',
      features: ['Batch Downloads', 'Quality Selection', 'Format Conversion', 'Playlist Management']
    },
    {
      id: 4,
      icon: '☁️',
      title: 'Google Drive Integration',
      description: 'Seamlessly organize and backup your files with intelligent Google Drive automation.',
      features: ['Auto Backup', 'Smart Folder Organization', 'File Sync', 'Storage Optimization']
    },
    {
      id: 5,
      icon: '🔄',
      title: 'Workflow Automation',
      description: 'Create custom automation workflows that connect all your services and tools.',
      features: ['Custom Triggers', 'Multi-step Workflows', 'Conditional Logic', 'API Integrations']
    },
    {
      id: 6,
      icon: '📊',
      title: 'Analytics & Reporting',
      description: 'Track your automation performance with detailed analytics and custom reports.',
      features: ['Performance Metrics', 'Usage Analytics', 'Custom Reports', 'Real-time Monitoring']
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: '$0',
      period: '/month',
      description: 'Perfect for personal use and small tasks',
      features: [
        'Up to 50 automations/month',
        'Gmail & Drive integration',
        'Basic YouTube downloads',
        'Email support',
        '100MB storage'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/month',
      description: 'Best for professionals and small businesses',
      features: [
        'Up to 1,000 automations/month',
        'All integrations included',
        'Advanced workflows',
        'Priority support',
        '50GB storage',
        'Custom templates'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$149',
      period: '/month',
      description: 'For teams and large-scale operations',
      features: [
        'Unlimited automations',
        'Team collaboration',
        'Custom integrations',
        '24/7 dedicated support',
        '500GB storage',
        'Advanced analytics'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Automation Services
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
              Streamline your digital life with powerful automation tools for Gmail, orders, YouTube, and Google Drive
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Automation Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save time and increase productivity with our comprehensive automation solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {(service.id==1 ||service.id==2 ||service.id==3) && <button className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg">
                 Feature Now Available 🥳
                </button>}
                {(service.id==4 ||service.id==5 ||service.id==6) && <button className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg">
                 Work in Progress 🥷🛠️
                </button>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Scale your automation needs with flexible pricing that grows with you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'ring-4 ring-indigo-500 scale-105 hover:scale-110' 
                    : 'hover:-translate-y-2'
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-2 px-4 rounded-full text-sm font-semibold mb-4 mx-auto w-fit">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-3 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.name=='Basic' && <button className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  Current Pack
                </button>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Automate Your Workflow?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who have transformed their productivity with our automation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to='/' className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Start Free Trial
            </Link>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;