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
  Star, Crown, Award, BrainCircuit, Infinity, Key
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
    
    // Simulate API call
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
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-gradient"></div>
            
            {/* Content */}
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

              {/* Social login */}
              {authMethod === 'social' && mode !== 'otp' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 space-y-3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-white/60">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Chrome, provider: 'Google', color: 'hover:bg-red-500/20' },
                      { icon: Github, provider: 'GitHub', color: 'hover:bg-gray-500/20' },
                      { icon: Twitter, provider: 'Twitter', color: 'hover:bg-blue-400/20' }
                    ].map(({ icon: Icon, provider, color }) => (
                      <button
                        key={provider}
                        onClick={() => handleSocialLogin(provider)}
                        className={`p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition ${color}`}
                      >
                        <Icon size={20} className="mx-auto" />
                      </button>
                    ))}
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
