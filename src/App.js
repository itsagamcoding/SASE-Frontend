// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';
import Services from './Components/Services';
import Contact from './Components/Contact';
import JobAlertPage from "./Components/JobAlerts/JobAlertPage";

// Firebase imports (centralized)
import { auth } from './firebase/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

// Auth Modal Component
const AuthModal = React.memo(({ 
  authMode, authData, authError, authLoading2, 
  handleInputChange, handleSubmit, closeAuthModal, switchAuthMode 
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <button onClick={closeAuthModal} className="text-gray-400 hover:text-white text-xl">✕</button>
      </div>

      {authError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={authData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            value={authData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
          <input
            type="password"
            name="password"
            value={authData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
            minLength={6}
          />
        </div>

        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={authData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={authLoading2}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {authLoading2 ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Loading...
            </div>
          ) : (
            authMode === 'login' ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={switchAuthMode}
            className="text-blue-400 hover:text-blue-300 ml-2 font-medium"
          >
            {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  </div>
));

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading2, setAuthLoading2] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetAuthData = useCallback(() => {
    setAuthData({ email: '', password: '', name: '', confirmPassword: '' });
    setAuthError('');
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setAuthData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = useCallback(async () => {
    if (!authData.email || !authData.password) return setAuthError('Please fill in all fields');
    setAuthLoading2(true);
    setAuthError('');

    try {
      await signInWithEmailAndPassword(auth, authData.email.trim(), authData.password);
      setShowAuthModal(false);
      resetAuthData();
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading2(false);
    }
  }, [authData, resetAuthData]);

  const handleSignup = useCallback(async () => {
    if (!authData.email || !authData.password || !authData.name) return setAuthError('Please fill in all fields');
    if (authData.password !== authData.confirmPassword) return setAuthError('Passwords do not match');
    setAuthLoading2(true);
    setAuthError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authData.email.trim(), authData.password);
      await updateProfile(userCredential.user, { displayName: authData.name });
      setShowAuthModal(false);
      resetAuthData();
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading2(false);
    }
  }, [authData, resetAuthData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (authMode === 'login') handleLogin();
    else handleSignup();
  }, [authMode, handleLogin, handleSignup]);

  const handleLogout = useCallback(async () => {
    try { await signOut(auth); } catch (err) { console.error(err); }
  }, []);

  const openLogin = useCallback(() => { setAuthMode('login'); setShowAuthModal(true); resetAuthData(); }, [resetAuthData]);
  const openSignup = useCallback(() => { setAuthMode('signup'); setShowAuthModal(true); resetAuthData(); }, [resetAuthData]);
  const closeAuthModal = useCallback(() => { setShowAuthModal(false); resetAuthData(); }, [resetAuthData]);
  const switchAuthMode = useCallback(() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); resetAuthData(); }, [authMode, resetAuthData]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar user={user} onLogin={openLogin} onSignup={openSignup} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home auth={auth} user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/job-alerts" element={<JobAlertPage userId={user?.uid} />} />
          </Routes>
        </main>
        {showAuthModal && (
          <AuthModal
            authMode={authMode}
            authData={authData}
            authError={authError}
            authLoading2={authLoading2}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            closeAuthModal={closeAuthModal}
            switchAuthMode={switchAuthMode}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
