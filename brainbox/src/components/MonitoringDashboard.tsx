import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Activity, Server, Database, Cpu, 
  HardDrive, RefreshCw, CheckCircle, XCircle,
  Clock, Users, Zap, Shield
} from 'lucide-react';
import { api } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

interface SystemHealth {
  status: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  database: {
    connected: boolean;
    state: string;
  };
  metrics: {
    activeUsers: number;
    totalRequests: number;
    totalErrors: number;
  };
}

interface ErrorLog {
  _id: string;
  name: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  environment: string;
}

export const MonitoringDashboard: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchHealth();
    fetchErrors();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchHealth();
        fetchErrors();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange]);

  const fetchHealth = async () => {
    try {
      const response = await api.get('/health/detailed');
      setHealth(response.data);
    } catch (error) {
      console.error('Failed to fetch health:', error);
    }
  };

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/debug/errors?hours=${timeRange === '24h' ? 24 : 168}`);
      setErrors(response.data);
    } catch (error) {
      console.error('Failed to fetch errors:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveError = async (errorId: string) => {
    try {
      await api.patch(`/api/v1/errors/${errorId}/resolve`);
      setErrors(errors.map(e => 
        e._id === errorId ? { ...e, resolved: true } : e
      ));
    } catch (error) {
      console.error('Failed to resolve error:', error);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getHealthColor = (status: string) => {
    return status === 'healthy' ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Monitoring
        </h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Auto-refresh
            </span>
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button
            onClick={() => {
              fetchHealth();
              fetchErrors();
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* System Health */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Server className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <span className={getHealthColor(health.status)}>
                {health.status === 'healthy' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              </span>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Server Status</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {health.status.toUpperCase()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Clock className="text-green-600 dark:text-green-400" size={20} />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Uptime</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatUptime(health.uptime)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Database className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <span className={health.database.connected ? 'text-green-500' : 'text-red-500'}>
                {health.database.connected ? <CheckCircle size={20} /> : <XCircle size={20} />}
              </span>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Database</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {health.database.state}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Activity className="text-yellow-600 dark:text-yellow-400" size={20} />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Users</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {health.metrics.activeUsers}
            </p>
          </motion.div>
        </div>
      )}

      {/* System Metrics */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Cpu size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Heap Used</span>
                  <span>{Math.round(health.memory.heapUsed / 1024 / 1024)} MB</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${(health.memory.heapUsed / health.memory.heapTotal) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>RSS</span>
                  <span>{Math.round(health.memory.rss / 1024 / 1024)} MB</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${(health.memory.rss / (512 * 1024 * 1024)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <HardDrive size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Request Stats</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs">Total Requests</span>
                <span className="text-sm font-medium">{health.metrics.totalRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Total Errors</span>
                <span className="text-sm font-medium text-red-600">{health.metrics.totalErrors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Error Rate</span>
                <span className="text-sm font-medium">
                  {health.metrics.totalRequests > 0
                    ? ((health.metrics.totalErrors / health.metrics.totalRequests) * 100).toFixed(2)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Security Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs">Rate Limiting Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs">CORS Configured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs">Helmet.js Enabled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Error Logs
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : errors.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No errors found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {errors.map((error) => (
              <div key={error._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={16}
                      className={error.resolved ? 'text-gray-400' : 'text-red-500'}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {error.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {error.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-gray-500">
                          {formatDistanceToNow(new Date(error.timestamp))} ago
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          error.environment === 'production'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {error.environment}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!error.resolved && (
                    <button
                      onClick={() => resolveError(error._id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
