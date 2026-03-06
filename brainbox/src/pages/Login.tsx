import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReCAPTCHA from 'react-google-recaptcha';
import OTPInput from 'react-otp-input';
import { 
  Mail, Lock, User, Phone, Eye, EyeOff, Chrome, Github, 
  Twitter, Fingerprint, Shield, Sparkles, Rocket, Zap,
  ArrowRight, CheckCircle, XCircle, AlertCircle, Globe,
  Star, Crown, Award, BrainCircuit, Infinity, Key,
  Facebook, Instagram, Linkedin, Apple, QrCode,
  Building2, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ParticleBackground } from '../components/3d/GalaxyBackground';

// Validation schemas
const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string().optional()
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const phoneSchema = z.object({
  phone: z.string().min(10, 'Valid phone number required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type FormData = z.infer<typeof emailSchema>;

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'social'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(emailSchema)
  });

  const password = watch('password', '');

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (mode === 'signup') {
      toast.success('Account created! Check your email for verification.');
      setMode('otp');
    } else if (mode === 'login') {
      toast.success('Welcome back, Explorer!');
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

  const handleDemoLogin = () => {
    setIsDemoMode(true);
    toast.loading('Creating demo session...', { duration: 2000 });
    setTimeout(() => {
      toast.success('Welcome to Demo Mode!');
      navigate('/dashboard?demo=true');
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    toast.loading(`Connecting to ${provider}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Logged in with ${provider}`);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <ParticleBackground>
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          {/* Glass card with neon border */}
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-gradient"></div>
            
            <div className="relative p-8">
              {/* Logo and title */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center mb-8"
              >
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-70 animate-pulse"></div>
                    <BrainCircuit className="relative text-white" size={64} strokeWidth={1.5} />
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                  BrainBox AI
                </h1>
                <p className="text-white/70 text-sm">
                  {mode === 'login' && 'Sign in to continue your journey'}
                  {mode === 'signup' && 'Join the future of learning'}
                  {mode === 'forgot' && 'Reset your password'}
                  {mode === 'otp' && 'Enter verification code'}
                </p>
              </motion.div>

              {/* Mode selector */}
              {mode !== 'otp' && (
                <div className="flex justify-center gap-2 mb-8">
                  {['login', 'signup'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m as 'login' | 'signup')}
                      className={`px-6 py-2 rounded-full transition-all ${
                        mode === m
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {m === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>
              )}

              {/* Auth method selector */}
              {mode !== 'otp' && mode !== 'forgot' && (
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { id: 'email', icon: Mail, label: 'Email' },
                    { id: 'phone', icon: Phone, label: 'Phone' },
                    { id: 'social', icon: Globe, label: 'Social' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setAuthMethod(method.id as any)}
                      className={`p-3 rounded-xl transition-all ${
                        authMethod === method.id
                          ? 'bg-white text-blue-600 shadow-lg scale-105'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <method.icon className="mx-auto mb-1" size={20} />
                      <span className="text-xs">{method.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Forms */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email/Phone inputs */}
                {mode !== 'otp' && (
                  <>
                    {authMethod === 'email' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                          <input
                            {...register('email')}
                            type="email"
                            placeholder="Email address"
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                        )}
                      </motion.div>
                    )}

                    {authMethod === 'phone' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <PhoneInput
                          country={'us'}
                          value={phone}
                          onChange={setPhone}
                          inputClass="!w-full !pl-12 !py-3 !bg-white/10 !border !border-white/20 !rounded-xl !text-white !focus:ring-2 !focus:ring-white/50"
                          buttonClass="!bg-transparent !border-r !border-white/20"
                          dropdownClass="!bg-gray-800 !text-white"
                          searchClass="!bg-gray-700 !text-white"
                          containerClass="!w-full"
                        />
                      </motion.div>
                    )}
                  </>
                )}

                {/* Password fields */}
                {mode !== 'otp' && mode !== 'forgot' && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                        <input
                          {...register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
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

                    {/* Password strength meter */}
                    {password && mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1"
                      >
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
                        <p className="text-xs text-white/60">
                          {passwordStrength <= 25 && 'Weak'}
                          {passwordStrength > 25 && passwordStrength <= 50 && 'Fair'}
                          {passwordStrength > 50 && passwordStrength <= 75 && 'Good'}
                          {passwordStrength > 75 && 'Strong'}
                        </p>
                      </motion.div>
                    )}

                    {/* Confirm password for signup */}
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                          <input
                            {...register('confirmPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm password"
                            className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
                        )}
                      </motion.div>
                    )}
                  </>
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
                      renderSeparator={<span className="mx-2 text-white/20">•</span>}
                      renderInput={(props) => (
                        <input
                          {...props}
                          className="!w-12 !h-14 bg-white/10 border border-white/20 rounded-xl text-white text-center text-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                      )}
                    />
                    <p className="text-center text-white/60 text-sm">
                      Enter the 6-digit code sent to your {authMethod}
                    </p>
                  </motion.div>
                )}

                {/* Forgot password link */}
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

                {/* reCAPTCHA */}
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

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition disabled:opacity-50 relative overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Code'}
                      {mode === 'otp' && 'Verify & Continue'}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                    </span>
                  )}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </motion.button>

                {/* Demo mode button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-2 group"
                >
                  <Rocket size={18} className="group-hover:rotate-12 transition" />
                  Try Demo Mode (No Signup)
                </button>
              </form>

              {/* Enhanced Social Login Section */}
              {authMethod === 'social' && mode !== 'otp' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 space-y-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-white/60">Sign in with</span>
                    </div>
                  </div>

                  {/* First row - Major platforms */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleSocialLogin('Google')}
                      className="p-3 bg-white/10 hover:bg-red-500/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Google"
                    >
                      <Chrome size={20} className="mx-auto group-hover:text-red-400" />
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('GitHub')}
                      className="p-3 bg-white/10 hover:bg-gray-500/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="GitHub"
                    >
                      <Github size={20} className="mx-auto group-hover:text-gray-300" />
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Facebook')}
                      className="p-3 bg-white/10 hover:bg-blue-600/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Facebook"
                    >
                      <Facebook size={20} className="mx-auto group-hover:text-blue-500" />
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Twitter')}
                      className="p-3 bg-white/10 hover:bg-sky-500/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Twitter / X"
                    >
                      <Twitter size={20} className="mx-auto group-hover:text-sky-400" />
                    </button>
                  </div>

                  {/* Second row - More platforms */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleSocialLogin('Instagram')}
                      className="p-3 bg-white/10 hover:bg-pink-500/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Instagram"
                    >
                      <Instagram size={20} className="mx-auto group-hover:text-pink-500" />
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('LinkedIn')}
                      className="p-3 bg-white/10 hover:bg-blue-500/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="LinkedIn"
                    >
                      <Linkedin size={20} className="mx-auto group-hover:text-blue-400" />
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Apple')}
                      className="p-3 bg-white/10 hover:bg-gray-400/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Apple ID"
                    >
                      <Apple size={20} className="mx-auto group-hover:text-gray-300" />
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Microsoft')}
                      className="p-3 bg-white/10 hover:bg-blue-400/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Microsoft"
                    >
                      <svg className="w-5 h-5 mx-auto group-hover:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.5 3L3 8.1v7.8l8.5 5.1 8.5-5.1V8.1L11.5 3zm0 2.5l6.5 3.9-6.5 3.9-6.5-3.9 6.5-3.9zM4.5 16.3v-5.1l6.5 3.9v5.1l-6.5-3.9zm14 0l-6.5 3.9v-5.1l6.5-3.9v5.1z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Third row - Additional platforms */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleSocialLogin('Discord')}
                      className="p-3 bg-white/10 hover:bg-indigo-500/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Discord"
                    >
                      <svg className="w-5 h-5 mx-auto group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.372.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.947 2.419-2.157 2.419z"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Slack')}
                      className="p-3 bg-white/10 hover:bg-purple-500/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Slack"
                    >
                      <svg className="w-5 h-5 mx-auto group-hover:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.179 14.801a1.857 1.857 0 0 1-1.857 1.857 1.857 1.857 0 0 1-1.857-1.857 1.857 1.857 0 0 1 1.857-1.857h1.857v1.857zm.928 0a1.857 1.857 0 0 1 1.857-1.857 1.857 1.857 0 0 1 1.857 1.857v4.642a1.857 1.857 0 0 1-1.857 1.857 1.857 1.857 0 0 1-1.857-1.857v-4.642zM8.964 6.179a1.857 1.857 0 0 1-1.857-1.857 1.857 1.857 0 0 1 1.857-1.857 1.857 1.857 0 0 1 1.857 1.857v1.857H8.964zm0 .928a1.857 1.857 0 0 1 1.857 1.857 1.857 1.857 0 0 1-1.857 1.857H4.322a1.857 1.857 0 0 1-1.857-1.857 1.857 1.857 0 0 1 1.857-1.857h4.642zM17.179 9.199a1.857 1.857 0 0 1 1.857-1.857 1.857 1.857 0 0 1 1.857 1.857 1.857 1.857 0 0 1-1.857 1.857h-1.857V9.199zm-.928 0a1.857 1.857 0 0 1-1.857 1.857 1.857 1.857 0 0 1-1.857-1.857V4.557a1.857 1.857 0 0 1 1.857-1.857 1.857 1.857 0 0 1 1.857 1.857v4.642zM15.036 17.821a1.857 1.857 0 0 1 1.857 1.857 1.857 1.857 0 0 1-1.857 1.857 1.857 1.857 0 0 1-1.857-1.857v-1.857h1.857zm0-.928a1.857 1.857 0 0 1-1.857-1.857 1.857 1.857 0 0 1 1.857-1.857h4.642a1.857 1.857 0 0 1 1.857 1.857 1.857 1.857 0 0 1-1.857 1.857h-4.642z"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Twitch')}
                      className="p-3 bg-white/10 hover:bg-purple-600/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Twitch"
                    >
                      <svg className="w-5 h-5 mx-auto group-hover:text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.265 3L3 6.236v13.223h4.502V21l2.531.001L12.564 19.5H16.5L21 15.021V3H4.265zm14.859 11.293l-2.946 2.946h-3.75l-2.566 2.566V17.24H5.742V4.793h13.382v9.5zm-2.946-5.838v4.993h-1.875V8.455h1.875zm-4.454 0v4.993h-1.874V8.455h1.874z"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Message')}
                      className="p-3 bg-white/10 hover:bg-green-500/20 border border-white/20 rounded-xl text-white transition-all hover:scale-110 group"
                      title="Message / SMS"
                    >
                      <MessageCircle size={20} className="mx-auto group-hover:text-green-400" />
                    </button>
                  </div>

                  {/* Advanced options row */}
                  <div className="flex justify-center gap-4 pt-2">
                    <button
                      onClick={() => handleSocialLogin('QR Code')}
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
                    >
                      <QrCode size={16} className="group-hover:text-purple-400" />
                      <span>QR Code</span>
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Company SSO')}
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
                    >
                      <Building2 size={16} className="group-hover:text-blue-400" />
                      <span>Company SSO</span>
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Passkey')}
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
                    >
                      <Key size={16} className="group-hover:text-yellow-400" />
                      <span>Passkey</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Security badges */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Shield size={12} /> 256-bit encryption
                </span>
                <span className="flex items-center gap-1">
                  <Fingerprint size={12} /> Biometric ready
                </span>
                <span className="flex items-center gap-1">
                  <Key size={12} /> 2FA support
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} /> SOC2 Type II
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ParticleBackground>
  );
};

export default Login;
