import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { Calendar, TrendingUp, Users, Brain, Clock, Target } from 'lucide-react';

interface AnalyticsData {
  studyTime: { date: string; minutes: number }[];
  subjectDistribution: { name: string; value: number }[];
  weeklyProgress: { day: string; flashcards: number; notes: number; quizzes: number }[];
  performance: { date: string; accuracy: number; speed: number }[];
  achievements: { name: string; progress: number; total: number }[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

interface AnalyticsDashboardProps {
  data?: AnalyticsData;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  // Sample data if none provided
  const defaultData: AnalyticsData = {
    studyTime: Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      minutes: Math.floor(Math.random() * 120) + 30
    })),
    subjectDistribution: [
      { name: 'Mathematics', value: 35 },
      { name: 'Physics', value: 25 },
      { name: 'Chemistry', value: 20 },
      { name: 'Biology', value: 15 },
      { name: 'Computer Science', value: 5 }
    ],
    weeklyProgress: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      flashcards: Math.floor(Math.random() * 30) + 10,
      notes: Math.floor(Math.random() * 15) + 5,
      quizzes: Math.floor(Math.random() * 8) + 2
    })),
    performance: Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      accuracy: Math.floor(Math.random() * 30) + 60,
      speed: Math.floor(Math.random() * 40) + 40
    })),
    achievements: [
      { name: 'Flashcards Master', progress: 75, total: 100 },
      { name: 'Quiz Champion', progress: 60, total: 100 },
      { name: 'Consistent Learner', progress: 90, total: 100 },
      { name: 'Note Taker', progress: 45, total: 100 }
    ]
  };

  const analyticsData = data || defaultData;

  const stats = [
    { label: 'Total Study Time', value: '142h 30m', icon: Clock, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Avg. Accuracy', value: '78%', icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+5%' },
    { label: 'Active Days', value: '24', icon: Calendar, color: 'from-purple-500 to-pink-500', change: '70%' },
    { label: 'Subjects', value: '8', icon: Brain, color: 'from-orange-500 to-red-500', change: '+2' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Study Time Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Study Time Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.studyTime}>
              <defs>
                <linearGradient id="studyTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#studyTimeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Subject Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Weekly Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="flashcards" fill="#3b82f6" />
                <Bar dataKey="notes" fill="#8b5cf6" />
                <Bar dataKey="quizzes" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Performance Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.performance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="accuracy"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="speed"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Achievements Progress</h3>
        <div className="space-y-4">
          {analyticsData.achievements.map((achievement, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {achievement.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.progress}/{achievement.total}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${
                    index === 0 ? 'from-blue-500 to-cyan-500' :
                    index === 1 ? 'from-purple-500 to-pink-500' :
                    index === 2 ? 'from-green-500 to-emerald-500' :
                    'from-orange-500 to-red-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
