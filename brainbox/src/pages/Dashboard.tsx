import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Zap, BookOpen, BarChart3, LogOut, Sparkles, Users, Settings,
  Calendar, Clock, Award, TrendingUp, Target, Menu, X, Bell, Search,
  Moon, Sun, User, Home, PieChart, MessageSquare, Code, Star,
  ChevronRight, Plus, Filter, Download, Share2, CheckCircle
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../store';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { debounce } from '../utils/performance';

// Lazy load heavy components
const AIChat = lazy(() => import('../components/ai/AIChat').catch(() => ({ default: () => <div>AI Chat coming soon</div> })));
const AnalyticsDashboard = lazy(() => import('../components/analytics/AnalyticsDashboard').catch(() => ({ default: () => <div>Analytics coming soon</div> })));
const FlashcardSystem = lazy(() => import('../components/flashcards/FlashcardSystem').catch(() => ({ default: () => <div>Flashcards coming soon</div> })));
const NoteTakingSystem = lazy(() => import('../components/notes/NoteTakingSystem').catch(() => ({ default: () => <div>Notes coming soon</div> })));

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Debounced search
  const debouncedSearch = debounce((value: string) => {
    console.log('Searching:', value);
    // Implement search logic
  }, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const stats = [
    { label: 'Study Streak', value: '7 days', icon: Calendar, color: 'from-orange-500 to-red-500', change: '+2 days' },
    { label: 'Flashcards', value: '124', icon: Zap, color: 'from-blue-500 to-purple-500', change: '+12 today' },
    { label: 'Study Time', value: '12.5h', icon: Clock, color: 'from-green-500 to-teal-500', change: '+2.5h' },
    { label: 'Achievements', value: '8', icon: Award, color: 'from-yellow-500 to-orange-500', change: '3 new' },
    { label: 'Mastery', value: '65%', icon: TrendingUp, color: 'from-purple-500 to-pink-500', change: '+5%' },
    { label: 'Daily Goal', value: '80%', icon: Target, color: 'from-indigo-500 to-blue-500', change: '20% left' },
  ];

  const recentActivity = [
    { id: 1, type: 'flashcard', title: 'Advanced Mathematics', time: '2h ago', xp: 50 },
    { id: 2, type: 'quiz', title: 'Physics Quiz', time: '5h ago', xp: 100 },
    { id: 3, type: 'note', title: 'Chemistry Notes', time: '1d ago', xp: 30 },
    { id: 4, type: 'achievement', title: '7 Day Streak', time: '2d ago', xp: 200 },
  ];

  const notifications = [
    { id: 1, text: 'New flashcard set available', time: '5m ago', read: false },
    { id: 2, text: 'Study streak: 7 days!', time: '1h ago', read: false },
    { id: 3, text: 'Quiz results ready', time: '2h ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'flashcards', label: 'Flashcards', icon: Zap },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'ai-chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div className="flex items-center gap-2">
                  <Brain className="text-blue-600" size={32} />
                  <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    BrainBox AI
                  </h1>
                </div>
              </div>

              {/* Search - hidden on mobile */}
              <div className="hidden md:block flex-1 max-w-lg mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search flashcards, notes, quizzes..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    aria-label="Notifications"
                  >
                    <Bell size={20} className={darkMode ? 'text-white' : 'text-gray-600'} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
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
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Notifications
                          </h3>
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

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.displayName?.[0] || user?.username?.[0] || 'U'}
                    </span>
                  </div>
                  <span className={`hidden sm:inline ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user?.displayName || user?.username || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`fixed left-0 top-16 bottom-0 w-64 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg z-40 overflow-y-auto`}
            >
              <div className="p-4">
                {/* User welcome */}
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Welcome back,</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user?.displayName || user?.username || 'Learner'}!
                  </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick actions */}
                <div className="mt-8 space-y-2">
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  } transition`}>
                    <Plus size={20} />
                    <span>Quick Add</span>
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  } transition`}>
                    <Filter size={20} />
                    <span>Filter</span>
                  </button>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`transition-all ${sidebarOpen ? 'md:ml-64' : 'ml-0'} p-4 sm:p-6 lg:p-8`}>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.displayName || 'Learner'}! 👋</h2>
            <p className="opacity-90 mb-4">You're making great progress. Keep it up!</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition">
                Continue Learning
              </button>
              <button className="px-4 py-2 bg-white/20 rounded-lg font-semibold hover:bg-white/30 transition">
                Set Goal
              </button>
            </div>
          </motion.div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 sm:p-6 rounded-xl shadow-lg ${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } hover:shadow-xl transition cursor-pointer`}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                          <stat.icon className="text-white" size={20} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-1 dark:text-white">{stat.value}</h3>
                        <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                        <p className="text-xs text-green-600 mt-2">{stat.change}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className={`p-4 sm:p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className={`text-lg sm:text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          } transition cursor-pointer`}
                        >
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {activity.title}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {activity.time}
                            </p>
                          </div>
                          <span className="text-green-600 font-medium">+{activity.xp} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Lazy loaded components with Suspense */}
              {activeTab === 'ai-chat' && (
                <Suspense fallback={<Skeleton count={5} />}>
                  <AIChat />
                </Suspense>
              )}

              {activeTab === 'analytics' && (
                <Suspense fallback={<Skeleton count={10} />}>
                  <AnalyticsDashboard />
                </Suspense>
              )}

              {activeTab === 'flashcards' && (
                <Suspense fallback={<Skeleton count={8} />}>
                  <FlashcardSystem />
                </Suspense>
              )}

              {activeTab === 'notes' && (
                <Suspense fallback={<Skeleton count={6} />}>
                  <NoteTakingSystem />
                </Suspense>
              )}

              {activeTab === 'settings' && (
                <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Settings
                  </h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Settings panel coming soon...
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
