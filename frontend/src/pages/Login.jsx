import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'Admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] animate-pulse-slow"></div>

      <div className="max-w-lg w-full px-6 relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl mb-6 glass-card">
            <div className="bg-primary-600 p-3 rounded-xl text-white shadow-lg shadow-primary-200">
              <LogIn size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Timeoff<span className="text-primary-600">Sync</span>
          </h1>
          <p className="text-slate-500 font-medium">Welcome back! Please enter your details.</p>
        </div>

        <div className="glass-card bg-white/80 rounded-3xl p-8 md:p-10 shadow-2xl shadow-primary-100/50 border border-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center space-x-3 text-sm animate-shake">
                <AlertCircle size={20} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block transition-colors group-focus-within:text-primary-600">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-medium"
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 transition-colors group-focus-within:text-primary-600">
                    Password
                  </label>
                  <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-medium"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full premium-gradient hover:brightness-110 text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              New to TimeoffSync?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-10 text-slate-400 text-sm font-medium">
          &copy; 2026 TimeoffSync Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
