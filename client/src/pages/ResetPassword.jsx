import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppProvider';
import toast from 'react-hot-toast';

function ResetPassword() {
  const { resetPassword } = useAppContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setIsValidToken(false);
      toast.error('Invalid reset link');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token, password);
      if (result.success) {
        // User will be automatically logged in and redirected by the context
        toast.success('Password reset successful! You are now logged in.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 relative overflow-hidden'>
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl"></div>

        <div className='glass-card p-10 rounded-3xl w-full sm:w-[480px] text-slate-700 relative z-10 shadow-2xl text-center'>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-slate-800 mb-4'>Invalid Reset Link</h2>
          <p className='text-slate-600 mb-6'>
            This password reset link is invalid or has expired. Please request a new password reset.
          </p>
          <button
            onClick={() => navigate('/login')}
            className='btn-modern w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-lg transition-all duration-300'
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>Reset Your Password</h2>
          <p className='text-slate-600'>Enter your new password below to complete the reset process.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password input */}
          <div className='space-y-2'>
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input-modern w-full pl-12 pr-12 py-3 rounded-2xl font-medium"
                placeholder='Enter your new password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
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
          </div>

          {/* Confirm Password input */}
          <div className='space-y-2'>
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input-modern w-full pl-12 pr-12 py-3 rounded-2xl font-medium"
                placeholder='Confirm your new password'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? (
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
          </div>

          {/* Password requirements */}
          <div className="glass rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg bg-blue-100">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className='text-blue-600 text-sm font-medium'>Password must be at least 6 characters long</p>
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
                <span>Resetting Password...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Reset Password</span>
              </div>
            )}
          </button>
        </form>

        {/* Back to login */}
        <div className='text-center mt-8'>
          <div className="glass rounded-2xl p-4 border border-slate-200/50">
            <p className='text-sm text-slate-600'>
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className='text-purple-600 font-semibold hover:text-purple-700 transition-colors'
              >
                Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;


