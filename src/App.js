import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';
import Services from './Components/Services';
import Contact from './Components/Contact';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

// Your Firebase config
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdlmef1rPnmXy4IssTLONvnxz1DtYmhSU",
  authDomain: "sase-2449b.firebaseapp.com",
  databaseURL: "https://sase-2449b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sase-2449b",
  storageBucket: "sase-2449b.firebasestorage.app",
  messagingSenderId: "380480530636",
  appId: "1:380480530636:web:9991f969622922df8cba69",
  measurementId: "G-1E6SJGTQG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


const AuthModal = React.memo(({ 
  authMode, 
  authData, 
  authError, 
  authLoading2, 
  handleInputChange, 
  handleSubmit, 
  closeAuthModal, 
  switchAuthMode 
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <button
          onClick={closeAuthModal}
          className="text-gray-400 hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {authError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={authData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={authData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={authData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
            required
            minLength={6}
            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={authData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={authLoading2}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            className="text-blue-400 hover:text-blue-300 ml-2 font-medium transition-colors"
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
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading2, setAuthLoading2] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
      if (firebaseUser) {
        // Create user object that matches the dropdown component expectations
        const userData = {
          user_id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          created_at: firebaseUser.metadata.creationTime,
          last_login: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          photoURL: firebaseUser.photoURL
        };
        console.log('Setting user data:', userData);
        setUser(userData);
      } else {
        console.log('Clearing user data');
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Memoized handlers to prevent re-creation on every render
  const handleLogin = useCallback(async () => {
    console.log('Login attempt with:', { email: authData.email, password: '***' });
    
    if (!authData.email || !authData.password) {
      setAuthError('Please enter both email and password');
      return;
    }

    if (!authData.email.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }

    setAuthLoading2(true);
    setAuthError('');

    try {
      console.log('Attempting Firebase login...');
      const userCredential = await signInWithEmailAndPassword(auth, authData.email.trim(), authData.password);
      console.log('Login successful:', userCredential.user.email);
      setShowAuthModal(false);
      resetAuthData();
    } catch (error) {
      console.error('Login error details:', {
        code: error.code,
        message: error.message,
        email: authData.email
      });
      setAuthError(getFirebaseErrorMessage(error.code));
    } finally {
      setAuthLoading2(false);
    }
  }, [authData.email, authData.password]);

  // Handle signup
  const handleSignup = useCallback(async () => {
    console.log('Signup attempt with:', { 
      email: authData.email, 
      name: authData.name,
      password: '***',
      confirmPassword: '***'
    });

    if (!authData.email || !authData.password || !authData.name) {
      setAuthError('Please fill in all required fields');
      return;
    }

    if (!authData.email.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }

    if (authData.password !== authData.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    if (authData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }

    setAuthLoading2(true);
    setAuthError('');

    try {
      console.log('Attempting Firebase signup...');
      const userCredential = await createUserWithEmailAndPassword(auth, authData.email.trim(), authData.password);
      console.log('Signup step 1 successful, updating profile...');
      
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: authData.name
      });

      console.log('Signup fully successful:', userCredential.user.email);
      setShowAuthModal(false);
      resetAuthData();
    } catch (error) {
      console.error('Signup error details:', {
        code: error.code,
        message: error.message,
        email: authData.email
      });
      setAuthError(getFirebaseErrorMessage(error.code));
    } finally {
      setAuthLoading2(false);
    }
  }, [authData.email, authData.password, authData.name, authData.confirmPassword]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Reset auth data
  const resetAuthData = useCallback(() => {
    setAuthData({ email: '', password: '', name: '', confirmPassword: '' });
    setAuthError('');
  }, []);

  // Open login modal
  const openLogin = useCallback(() => {
    setAuthMode('login');
    setShowAuthModal(true);
    resetAuthData();
  }, [resetAuthData]);

  // Open signup modal
  const openSignup = useCallback(() => {
    setAuthMode('signup');
    setShowAuthModal(true);
    resetAuthData();
  }, [resetAuthData]);

  // Close modal
  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
    resetAuthData();
  }, [resetAuthData]);

  // Get user-friendly error messages
  const getFirebaseErrorMessage = useCallback((errorCode) => {
    console.log('Firebase error code:', errorCode);
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/operation-not-allowed':
        return 'Email/password authentication is not enabled.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return `Authentication error: ${errorCode}. Please try again.`;
    }
  }, []);

  // Handle input changes - FIXED to prevent cursor loss
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setAuthData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (authMode === 'login') {
      handleLogin();
    } else {
      handleSignup();
    }
  }, [authMode, handleLogin, handleSignup]);

  // Switch auth mode
  const switchAuthMode = useCallback(() => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    resetAuthData();
  }, [authMode, resetAuthData]);

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar 
          user={user}
          onLogin={openLogin}
          onSignup={openSignup}
          onLogout={handleLogout}
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Home auth={auth} user={user}/>} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Auth Modal */}
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