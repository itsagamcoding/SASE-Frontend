import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Bell } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';

const Navbar = ({ user, onLogin, onSignup, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    const baseClasses = "relative px-4 py-2 rounded-lg transition-all duration-300 font-medium";
    const activeClasses = "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105";
    const inactiveClasses = "text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  const mobileNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-gray-700/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AntiBang
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm border border-gray-700/50">
                <Link to="/" className={linkClass('/')}>
                  <span className="relative z-10">Home</span>
                  {isActive('/') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 animate-pulse"></div>
                  )}
                </Link>
                <Link to="/about" className={linkClass('/about')}>
                  <span className="relative z-10">About</span>
                  {isActive('/about') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 animate-pulse"></div>
                  )}
                </Link>
                <Link to="/services" className={linkClass('/services')}>
                  <span className="relative z-10">Services</span>
                  {isActive('/services') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 animate-pulse"></div>
                  )}
                </Link>
                <Link to="/contact" className={linkClass('/contact')}>
                  <span className="relative z-10">Contact</span>
                  {isActive('/contact') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 animate-pulse"></div>
                  )}
                </Link>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center space-x-3 ml-6">
                {/* Notifications - only show when user is logged in */}
                {user && (
                  <button className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1 animate-ping"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
                    <Bell className="w-5 h-5" />
                  </button>
                )}
                
                {/* User Profile Dropdown */}
                <UserProfileDropdown
                  user={user}
                  onLogin={onLogin}
                  onSignup={onSignup}
                  onLogout={onLogout}
                />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <UserProfileDropdown
                user={user}
                onLogin={onLogin}
                onSignup={onSignup}
                onLogout={onLogout}
              />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="px-4 py-2 space-y-1 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Navbar Glow Effect */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </>
  );
};

export default Navbar;