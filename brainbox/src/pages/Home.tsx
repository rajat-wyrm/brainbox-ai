import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Users, Sparkles, ArrowRight } from 'lucide-react';
import { FloatingBrain } from '../components/3d/Brain3D';

const Home = () => {
  const features = [
    { icon: Brain, title: 'AI-Powered Learning', desc: 'Smart flashcards and quizzes generated instantly' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance with instant responses' },
    { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security for your data' },
    { icon: Users, title: 'Collaborative', desc: 'Study together in real-time' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      {/* Navbar */}
      <nav className="glass fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FloatingBrain className="w-10 h-10" />
            <span className="text-2xl font-bold text-white">BrainBox AI</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 text-white hover:text-blue-200 transition">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Learn Smarter with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                AI
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Transform your learning experience with AI-powered flashcards, 
              intelligent quizzes, and real-time collaboration.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 glass-card text-white rounded-xl font-semibold text-lg hover:bg-white/30 transition"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* 3D Brain */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16"
          >
            <div className="w-full h-[400px]">
              <iframe
                src="https://my.spline.design/brain-8daa9fcb62cf7b557d24d4063e26aa4d/"
                className="w-full h-full rounded-2xl"
                style={{ border: 'none' }}
                title="3D Brain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
            Why Choose BrainBox AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 hover:shadow-xl transition"
              >
                <feature.icon size={40} className="text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-xl opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-xl opacity-90">Flashcards Created</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-xl opacity-90">Subjects</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who are already learning smarter with AI.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition"
          >
            Start Learning Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
