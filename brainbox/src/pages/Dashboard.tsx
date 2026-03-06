import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, Zap, BookOpen, MessageSquare, BarChart3, LogOut, 
  Sparkles, Users, Settings, Calendar, Clock, Award 
} from 'lucide-react';
import { FloatingBrain } from '../components/3d/Brain3D';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../store';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const stats = [
    { label: 'Study Streak', value: '7 days', icon: Calendar, color: 'from-orange-500 to-red-500' },
    { label: 'Flashcards', value: '124', icon: Zap, color: 'from-blue-500 to-purple-500' },
    { label: 'Study Time', value: '12.5h', icon: Clock, color: 'from-green-500 to-teal-500' },
    { label: 'Achievements', value: '8', icon: Award, color: 'from-yellow-500 to-orange-500' },
  ];

  const features = [
    { icon: Brain, title: 'AI Learning', color: 'from-blue-500 to-purple-500' },
    { icon: BookOpen, title: 'Smart Notes', color: 'from-green-500 to-teal-500' },
    { icon: MessageSquare, title: 'AI Chat', color: 'from-purple-500 to-pink-500' },
    { icon: Users, title: 'Collaborate', color: 'from-yellow-500 to-orange-500' },
    { icon: BarChart3, title: 'Analytics', color: 'from-red-500 to-pink-500' },
    { icon: Settings, title: 'Settings', color: 'from-gray-500 to-gray-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FloatingBrain className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BrainBox AI
              </h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.displayName || 'User'}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="text-yellow-500" />
          Learning Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer group"
              onClick={() => setActiveTab(feature.title.toLowerCase())}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">Click to explore</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Studied "Advanced Mathematics"</p>
                  <p className="text-sm text-gray-500">{i + 1} hour{i !== 0 ? 's' : ''} ago</p>
                </div>
                <span className="text-green-600 font-medium">+50 XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
