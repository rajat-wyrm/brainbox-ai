import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, LogIn, Sparkles, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../hooks/redux';
import { setUser } from '../store';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { email, password, username })
      });

      const data = await response.json();
      
      if (response.ok) {
        dispatch(setUser({ user: data.user, token: data.token }));
        toast.success(isLogin ? 'Welcome back!' : 'Account created!');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Logo and title */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Sparkles className="relative text-white" size={48} />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              BrainBox AI
            </h1>
            <p className="text-white/70">
              {isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
            </p>
          </motion.div>

          {/* Mode toggle */}
          <div className="flex justify-center gap-4 mb-8">
            {(['login', 'signup'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setIsLogin(mode === 'login')}
                className={`px-6 py-2 rounded-full transition-all ${
                  (isLogin && mode === 'login') || (!isLogin && mode === 'signup')
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transition disabled:opacity-50 relative overflow-hidden group mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <LogIn size={18} className="group-hover:translate-x-1 transition" />
                </span>
              )}
            </motion.button>
          </form>

          {/* Security badges */}
          <div className="flex justify-center gap-4 mt-6 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Shield size={12} /> 256-bit encryption
            </span>
            <span className="flex items-center gap-1">
              <Shield size={12} /> 2FA ready
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
