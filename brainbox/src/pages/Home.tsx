import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <nav className="fixed w-full z-50 bg-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-white">BrainBox AI</span>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 text-white hover:text-blue-200 transition">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
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
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-2xl transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
