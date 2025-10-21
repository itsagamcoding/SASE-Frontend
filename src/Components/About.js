import React from 'react';
import Agam from '../Assets/agam.jpg'
import Riya from '../Assets/riya.jpg'
import Rohit from '../Assets/rohit.jpg'
import Smriti from '../Assets/smriti.jpg'
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Globe, 
  Zap, 
  Shield, 
  Lightbulb,
  TrendingUp,
  Coffee,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const About = () => {
  const stats = [
    { number: '500+', label: 'Projects Completed', icon: Award },
    { number: '50+', label: 'Happy Clients', icon: Heart },
    { number: '25+', label: 'Team Members', icon: Users },
    { number: '5+', label: 'Years Experience', icon: TrendingUp }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly push boundaries to deliver cutting-edge solutions that drive business growth.'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Our commitment to quality ensures dependable solutions you can trust for your business.'
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'We optimize processes and deliver results faster without compromising on quality.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving clients worldwide with 24/7 support and multilingual capabilities.'
    }
  ];

  const team = [
    {
      name: 'Agam Tiwari',
      role: 'CEO & Founder',
      image: Agam,
      description: 'Visionary leader with 2+ years in tech industry'
    },
    {
      name: 'Riya Singh',
      role: 'CTO',
      image: Riya,
      description: 'Technical expert driving our innovation forward'
    },
    {
      name: 'Rohit Sharma',
      role: 'Head of Design',
      image: Rohit,
      description: 'Creative mind behind our beautiful user experiences'
    },
    {
      name: 'Smriti Verma',
      role: 'Project Manager',
      image: Smriti,
      description: 'Ensuring projects deliver on time and exceed expectations'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">SASE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're not just another tech company. We're the explosion of innovation that disrupts the ordinary and creates extraordinary digital experiences.
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Target className="w-10 h-10 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                At SASE, we believe in the power of technology to transform businesses and lives. Our mission is to create innovative solutions that don't just meet expectations—they exceed them. We're here to be the catalyst that propels your business into the future.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Globe className="w-10 h-10 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become the global leader in digital transformation, empowering businesses worldwide with cutting-edge technology solutions. We envision a world where every company, regardless of size, has access to enterprise-grade digital tools that drive growth and success.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Our Impact in Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center text-white">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-full">
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            The brilliant minds behind SASE's success
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 mx-auto w-48 h-48 overflow-hidden rounded-full">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Culture Section */}
      <div className="py-16 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose SASE?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Coffee className="w-6 h-6 text-cyan-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Work-Life Balance</h3>
                    <p className="text-gray-300">We believe great work comes from happy teams. Our flexible work environment promotes creativity and well-being.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="w-6 h-6 text-yellow-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Cutting-Edge Technology</h3>
                    <p className="text-gray-300">We stay ahead of the curve, using the latest technologies and methodologies to deliver superior results.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="w-6 h-6 text-pink-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Client-Centric Approach</h3>
                    <p className="text-gray-300">Your success is our success. We work closely with clients to understand their unique needs and deliver tailored solutions.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <MapPin className="w-5 h-5 mr-3 text-cyan-400" />
                    <span>Gwalior,MP</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Mail className="w-5 h-5 mr-3 text-cyan-400" />
                    <span>agam@sase.com</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-3 text-cyan-400" />
                    <span>+91 7247578156</span>
                  </div>
                </div>
                <button className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-8 rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  Start Your Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;