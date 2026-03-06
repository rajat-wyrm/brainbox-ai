import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, Phone, Eye, EyeOff, 
  Chrome, Github, Loader2, CheckCircle, XCircle,
  ArrowRight, Sparkles, Shield, Fingerprint
} from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OTPInput from 'react-otp-input';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { AuthBackground } from '../components/3d/AuthBackground';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.password)) strength += 25;
      if (/[0-9]/.test(formData.password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (method === 'email' && !formData.email) {
      newErrors.email = 'Email is required';
    } else if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (method === 'phone' && !formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (method === 'phone' && formData.phone.length < 10) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
    }
    
    if (mode === 'signup') {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (mode === 'signup') {
      toast.success('Account created! Please verify your email.');
      setMode('otp');
    } else if (mode === 'login') {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else if (mode === 'forgot') {
      toast.success('Reset code sent!');
      setMode('otp');
    } else if (mode === 'otp') {
      if (otp.length === 6) {
        toast.success('Verification successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid OTP');
      }
    }
    
    setLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    toast.loading(`Connecting to ${provider}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Logged in with ${provider}`);
      navigate('/dashboard');
    }, 2000);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <AuthBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-gradient"></div>
          
          <div className="relative p-8">
            {/* Logo and Title */}
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
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
                {mode === 'login' && 'Welcome back! Sign in to continue'}
                {mode === 'signup' && 'Create your account to get started'}
                {mode === 'forgot' && 'Reset your password'}
                {mode === 'otp' && 'Enter verification code'}
              </p>
            </motion.div>

            {/* Mode Toggle */}
            {mode !== 'otp' && (
              <div className="flex justify-center gap-4 mb-8">
                {(['login', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-6 py-2 rounded-full transition-all ${
                      mode === m
                        ? 'bg-white text-blue-600 shadow-lg scale-105'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>
            )}

            {/* Auth Method Toggle (Email/Phone) */}
            {mode !== 'otp' && mode !== 'forgot' && (
              <div className="flex bg-white/5 rounded-full p-1 mb-6">
                {(['email', 'phone'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                      method === m
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {m === 'email' ? '📧 Email' : '📱 Phone'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username (Signup only) */}
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition ${
                        errors.username ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-white/50'
                      }`}
                    />
                    {errors.username && (
                      <p className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-red-400">
                        {errors.username}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Email Input */}
              {method === 'email' && mode !== 'otp' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-white/50'
                      }`}
                    />
                  </div>
                </motion.div>
              )}

              {/* Phone Input */}
              {method === 'phone' && mode !== 'otp' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <PhoneInput
                    country={'us'}
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    inputClass="!w-full !pl-12 !py-3 !bg-white/10 !border !text-white !rounded-lg !focus:ring-2"
                    buttonClass="!bg-transparent !border-r !border-white/20"
                    dropdownClass="!bg-gray-800 !text-white"
                    searchClass="!bg-gray-700 !text-white"
                    containerClass="!w-full"
                  />
                </motion.div>
              )}

              {/* Password */}
              {mode !== 'otp' && mode !== 'forgot' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition ${
                        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-white/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password strength meter */}
                  {formData.password && mode === 'signup' && (
                    <div className="mt-2">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all ${
                              passwordStrength >= i * 25 ? getStrengthColor() : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        {passwordStrength <= 25 && 'Weak'}
                        {passwordStrength > 25 && passwordStrength <= 50 && 'Fair'}
                        {passwordStrength > 50 && passwordStrength <= 75 && 'Good'}
                        {passwordStrength > 75 && 'Strong'}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition ${
                        errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-white/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* OTP Input */}
              {mode === 'otp' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span className="mx-2 text-white/20">-</span>}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="!w-12 !h-12 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    )}
                  />
                  <p className="text-center text-white/60 text-sm">
                    Enter the 6-digit code sent to {method === 'email' ? formData.email : formData.phone}
                  </p>
                </motion.div>
              )}

              {/* Forgot Password Link */}
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* reCAPTCHA for signup */}
              {mode === 'signup' && (
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey="your-recaptcha-site-key"
                    onChange={(token) => setCaptchaToken(token)}
                    theme="dark"
                    size="normal"
                  />
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition disabled:opacity-50 relative overflow-hidden group"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={24} />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Code'}
                    {mode === 'otp' && 'Verify & Continue'}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                  </span>
                )}
                
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </motion.button>

              {/* Social Login */}
              {mode !== 'otp' && mode !== 'forgot' && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-white/60">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
                    >
                      <Chrome size={20} />
                      Google
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleSocialLogin('GitHub')}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
                    >
                      <Github size={20} />
                      GitHub
                    </motion.button>
                  </div>
                </>
              )}

              {/* Security badges */}
              <div className="flex justify-center gap-4 mt-6 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Shield size={12} /> 256-bit encryption
                </span>
                <span className="flex items-center gap-1">
                  <Fingerprint size={12} /> Biometric ready
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} /> 2FA support
                </span>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
