import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppProvider';

function Login() {
  // Destructure login, register, and navigate functions from context
  const { login, register, navigate } = useAppContext();

  // Track current form state: either 'login' or 'sign-up'
  const [state, setState] = useState('login');

  // Form input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error message to display to user
  const [error, setError] = useState("");

  // Loading state to prevent double submissions
  const [loading, setLoading] = useState(false);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setError(""); // Clear previous error
    setLoading(true); // Set loading to true during request

    try {
      if (state === 'sign-up') {
        // Call register function with user data
        await register({ name, email, password });
        setState('login'); // Switch to login view after successful sign-up
      } else {
        // Call login function
        await login({ email, password });
      }
    } catch (err) {
      // Show a user-friendly error message
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 relative overflow-hidden'>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-2xl"></div>

      <div className='glass-card p-10 rounded-3xl w-full sm:w-[480px] text-slate-700 relative z-10 shadow-2xl'>

        {/* Logo and Title */}
        <div className='text-center mb-8'>
          <div className='flex justify-center gap-3 items-center mb-4'>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-xl">
              <img src="./logo.png" className="size-8 filter brightness-0 invert" alt="Logo" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">FinTract-Lite</h1>
          </div>
          <p className='text-slate-600 font-medium'>Your smart financial companion</p>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>
            {state === "sign-up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className='text-slate-600'>
            {state === "sign-up" ? "Join us and take control of your finances" : "Sign in to continue your financial journey"}
          </p>
        </div>

        {/* Show error message */}
        {error && (
          <div className='glass rounded-2xl p-4 mb-6 border border-red-200/50'>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg bg-red-100">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className='text-red-600 text-sm font-medium'>{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input only for sign-up */}
          {state === "sign-up" && (
            <div className='space-y-2'>
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="input-modern w-full pl-12 pr-4 py-3 rounded-2xl font-medium"
                  placeholder='Enter your full name'
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className='space-y-2'>
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                className="input-modern w-full pl-12 pr-4 py-3 rounded-2xl font-medium"
                placeholder='Enter your email address'
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          {/* Password input */}
          <div className='space-y-2'>
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                className="input-modern w-full pl-12 pr-4 py-3 rounded-2xl font-medium"
                placeholder='Enter your password'
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className='btn-modern w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={state === "sign-up" ? "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" : "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"} />
                </svg>
                <span>{state === "sign-up" ? "Create Account" : "Sign In"}</span>
              </div>
            )}
          </button>
        </form>

        {/* Switch between Login and Sign Up */}
        <div className='text-center mt-8'>
          <div className="glass rounded-2xl p-4 border border-slate-200/50">
            {state === "sign-up" ? (
              <p className='text-sm text-slate-600'>
                Already have an account?{" "}
                <button
                  type="button"
                  className='text-purple-600 font-semibold hover:text-purple-700 transition-colors'
                  onClick={() => setState("login")}
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p className='text-sm text-slate-600'>
                Don't have an account?{" "}
                <button
                  type="button"
                  className='text-purple-600 font-semibold hover:text-purple-700 transition-colors'
                  onClick={() => setState("sign-up")}
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
