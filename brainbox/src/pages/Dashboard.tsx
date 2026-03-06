import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Zap, BookOpen, MessageSquare, BarChart3, LogOut, 
  Sparkles, Users, Settings, Calendar, Clock, Award, 
  TrendingUp, Target, Trophy, Activity, Moon, Sun,
  Menu, X, Bell, Search, Filter, Download, Upload,
  Share2, Bookmark, Flag, ThumbsUp, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New flashcard set available', time: '5m ago', read: false },
    { id: 2, text: 'Study streak: 7 days!', time: '1h ago', read: false },
    { id: 3, text: 'Quiz results ready', time: '2h ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const stats = [
    { label: 'Study Streak', value: '7 days', icon: Calendar, color: 'from-orange-500 to-red-500', change: '+2 days' },
    { label: 'Flashcards', value: '124', icon: Zap, color: 'from-blue-500 to-purple-500', change: '+12 today' },
    { label: 'Study Time', value: '12.5h', icon: Clock, color: 'from-green-500 to-teal-500', change: '+2.5h' },
    { label: 'Achievements', value: '8', icon: Award, color: 'from-yellow-500 to-orange-500', change: '3 new' },
    { label: 'Mastery Level', value: '65%', icon: TrendingUp, color: 'from-purple-500 to-pink-500', change: '+5%' },
    { label: 'Daily Goal', value: '80%', icon: Target, color: 'from-indigo-500 to-blue-500', change: '20% left' },
  ];

  const recentActivity = [
    { id: 1, type: 'flashcard', title: 'Advanced Mathematics', time: '2h ago', xp: 50, icon: Zap },
    { id: 2, type: 'quiz', title: 'Physics Quiz', time: '5h ago', xp: 100, icon: Trophy },
    { id: 3, type: 'note', title: 'Chemistry Notes', time: '1d ago', xp: 30, icon: BookOpen },
    { id: 4, type: 'achievement', title: '7 Day Streak', time: '2d ago', xp: 200, icon: Award },
  ];

  const recommendations = [
    { title: 'Calculus Review', difficulty: 'Hard', progress: 45, icon: Brain },
    { title: 'Physics Formulas', difficulty: 'Medium', progress: 70, icon: Zap },
    { title: 'Chemistry Basics', difficulty: 'Easy', progress: 90, icon: BookOpen },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu size={20} className={darkMode ? 'text-white' : 'text-gray-600'} />
              </button>
              <div className="flex items-center gap-2">
                <Brain className="text-blue-600" size={32} />
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  BrainBox AI
                </h1>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search flashcards, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-100 border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <Bell size={20} className={darkMode ? 'text-white' : 'text-gray-600'} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } border ${darkMode ? 'border-gray-700' : 'border-gray-200'} z-50`}
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Notifications
                        </h3>
                        <button
                          onClick={markAllRead}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b last:border-0 ${
                              darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                            } ${!notification.read && (darkMode ? 'bg-gray-700' : 'bg-blue-50')}`}
                          >
                            <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                              {notification.text}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed left-0 top-[73px] bottom-0 w-64 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg z-40 overflow-y-auto`}
          >
            <div className="p-4">
              <div className="space-y-1">
                {[
                  { icon: Brain, label: 'Dashboard', id: 'dashboard' },
                  { icon: Zap, label: 'Flashcards', id: 'flashcards' },
                  { icon: BookOpen, label: 'Notes', id: 'notes' },
                  { icon: MessageSquare, label: 'AI Chat', id: 'chat' },
                  { icon: BarChart3, label: 'Analytics', id: 'analytics' },
                  { icon: Users, label: 'Collaborate', id: 'collaborate' },
                  { icon: Settings, label: 'Settings', id: 'settings' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Pro Tip
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Create flashcards from your notes using AI for faster learning!
                </p>
                <button className="mt-3 text-blue-600 text-sm font-semibold hover:text-blue-700">
                  Try it now ?
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-0'} p-8`}>
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-6 rounded-2xl ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          } text-white`}
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, Learner! ??</h2>
          <p className="opacity-90 mb-4">You're making great progress. Keep it up!</p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition">
              Start Learning
            </button>
            <button className="px-4 py-2 bg-white/20 rounded-lg font-semibold hover:bg-white/30 transition">
              View Goals
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } hover:shadow-xl transition cursor-pointer group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition`}>
                  <stat.icon className="text-white" size={20} />
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1 dark:text-white">{stat.value}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    } transition cursor-pointer`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                      index % 2 === 0 ? 'from-blue-500 to-purple-500' : 'from-green-500 to-teal-500'
                    } flex items-center justify-center`}>
                      <activity.icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {activity.title}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activity.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 font-medium">+{activity.xp} XP</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Recommended
              </h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    } cursor-pointer hover:shadow-md transition`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <rec.icon className="text-white" size={16} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {rec.title}
                        </h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {rec.difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className={`text-xs font-semibold inline-block ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-blue-600">
                            {rec.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                        <div
                          style={{ width: `${rec.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Upload, label: 'Import Notes' },
            { icon: Download, label: 'Export Data' },
            { icon: Share2, label: 'Share Progress' },
            { icon: Bookmark, label: 'Saved Items' },
          ].map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } shadow-lg transition flex flex-col items-center gap-2`}
            >
              <action.icon size={24} className="text-blue-600" />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
