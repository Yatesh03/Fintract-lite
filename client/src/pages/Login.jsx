import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppProvider';

function Login() {
  // Destructure login, register, and navigate functions from context
  const { login, register, navigate, forgotPassword } = useAppContext();

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

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

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

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      const result = await forgotPassword(forgotEmail);
      if (result.success) {
        setShowForgotPassword(false);
        setForgotEmail("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setForgotLoading(false);
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
                type={showPassword ? "text" : "password"}
                className="input-modern w-full pl-12 pr-12 py-3 rounded-2xl font-medium"
                placeholder='Enter your password'
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* Forgot password link - only show in login mode */}
            {state === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h3>
              <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="input-modern w-full pl-12 pr-4 py-3 rounded-2xl font-medium"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
