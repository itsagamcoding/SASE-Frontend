import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, LogIn, UserPlus, ChevronDown } from 'lucide-react';

const UserProfileDropdown = ({ user, onLogin, onSignup, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Unknown';
    try {
      const date = new Date(lastLogin);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  // Handle login button click
  const handleLoginClick = () => {
    console.log('Login button clicked in dropdown');
    setIsOpen(false);
    if (onLogin) {
      onLogin();
    } else {
      console.error('onLogin function not provided');
    }
  };

  // Handle signup button click
  const handleSignupClick = () => {
    console.log('Signup button clicked in dropdown');
    setIsOpen(false);
    if (onSignup) {
      onSignup();
    } else {
      console.error('onSignup function not provided');
    }
  };

  // Handle logout button click
  const handleLogoutClick = () => {
    console.log('Logout button clicked in dropdown');
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      console.error('onLogout function not provided');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-110 transition-transform shadow-lg ${
          user ? 'bg-gradient-to-br from-green-400 to-blue-500' : 'bg-gradient-to-br from-gray-500 to-gray-600'
        }`}>
          {user ? getInitials(user.name || user.email) : 'AD'}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-lg overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                user ? 'bg-gradient-to-br from-green-400 to-blue-500' : 'bg-gradient-to-br from-gray-500 to-gray-600'
              }`}>
                {user ? getInitials(user.name || user.email) : 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{getUserDisplayName()}</h3>
                <p className="text-gray-400 text-sm truncate">
                  {user ? (user.email || 'No email') : 'Not signed in'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {user ? (
              // Authenticated user menu
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Add profile navigation logic here
                    console.log('Navigate to profile');
                  }}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Add settings navigation logic here
                    console.log('Navigate to settings');
                  }}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                
                <div className="border-t border-gray-700/50 my-2"></div>
                
                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              // Guest user menu
              <>
                <button
                  onClick={handleLoginClick}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </button>
                
                <button
                  onClick={handleSignupClick}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          {user && (
            <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-700/50">
              <p className="text-xs text-gray-500">
                Last login: {formatLastLogin(user.last_login)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;