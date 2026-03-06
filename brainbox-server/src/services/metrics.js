const client = require('prom-client');
const responseTime = require('response-time');
const logger = require('../utils/logger');

class MetricsService {
  constructor() {
    // Create a Registry to register metrics
    this.register = new client.Registry();
    
    // Add default metrics
    client.collectDefaultMetrics({ register: this.register });

    // HTTP request duration histogram
    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5]
    });

    // HTTP request counter
    this.httpRequestCounter = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });

    // Active users gauge
    this.activeUsers = new client.Gauge({
      name: 'active_users_total',
      help: 'Number of currently active users'
    });

    // Error counter
    this.errorCounter = new client.Counter({
      name: 'errors_total',
      help: 'Total number of errors',
      labelNames: ['type', 'code']
    });

    // Database query duration histogram
    this.dbQueryDuration = new client.Histogram({
      name: 'db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['collection', 'operation'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1]
    });

    // API response time gauge
    this.apiResponseTime = new client.Gauge({
      name: 'api_response_time_seconds',
      help: 'API response time in seconds',
      labelNames: ['endpoint']
    });

    // Memory usage gauge
    this.memoryUsage = new client.Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type']
    });

    // CPU usage gauge
    this.cpuUsage = new client.Gauge({
      name: 'cpu_usage_percent',
      help: 'CPU usage percentage'
    });

    // Register all metrics
    this.register.registerMetric(this.httpRequestDuration);
    this.register.registerMetric(this.httpRequestCounter);
    this.register.registerMetric(this.activeUsers);
    this.register.registerMetric(this.errorCounter);
    this.register.registerMetric(this.dbQueryDuration);
    this.register.registerMetric(this.apiResponseTime);
    this.register.registerMetric(this.memoryUsage);
    this.register.registerMetric(this.cpuUsage);
  }

  // Middleware to track HTTP requests
  trackHttpRequest() {
    return responseTime((req, res, time) => {
      const route = req.route ? req.route.path : req.path;
      const labels = {
        method: req.method,
        route: route,
        status_code: res.statusCode
      };

      this.httpRequestDuration.labels(labels).observe(time / 1000);
      this.httpRequestCounter.labels(labels).inc();

      // Track API response time
      this.apiResponseTime.labels({ endpoint: route }).set(time / 1000);

      // Update memory and CPU metrics periodically
      this.updateSystemMetrics();
    });
  }

  // Track database query
  trackDbQuery(collection, operation, duration) {
    this.dbQueryDuration.labels(collection, operation).observe(duration);
  }

  // Track error
  trackError(type, code = 500) {
    this.errorCounter.labels(type, code.toString()).inc();
  }

  // Update active users
  updateActiveUsers(count) {
    this.activeUsers.set(count);
  }

  // Update system metrics
  updateSystemMetrics() {
    const memory = process.memoryUsage();
    this.memoryUsage.labels({ type: 'rss' }).set(memory.rss);
    this.memoryUsage.labels({ type: 'heapTotal' }).set(memory.heapTotal);
    this.memoryUsage.labels({ type: 'heapUsed' }).set(memory.heapUsed);
    this.memoryUsage.labels({ type: 'external' }).set(memory.external);

    // CPU usage (simplified)
    const cpu = process.cpuUsage();
    const totalCPU = (cpu.user + cpu.system) / 1000000; // Convert to seconds
    this.cpuUsage.set(totalCPU);
  }

  // Get metrics endpoint handler
  getMetricsHandler() {
    return async (req, res) => {
      try {
        res.set('Content-Type', this.register.contentType);
        res.end(await this.register.metrics());
      } catch (error) {
        logger.error('Error getting metrics:', error);
        res.status(500).end();
      }
    };
  }

  // Get health check with detailed stats
  getHealthHandler() {
    return async (req, res) => {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        database: {
          connected: mongoose.connection.readyState === 1,
          state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
        },
        metrics: {
          activeUsers: this.activeUsers.values[0]?.value || 0,
          totalRequests: (await this.httpRequestCounter.get()).values.reduce((acc, v) => acc + v.value, 0),
          totalErrors: (await this.errorCounter.get()).values.reduce((acc, v) => acc + v.value, 0)
        }
      };

      res.json(health);
    };
  }
}

module.exports = new MetricsService();
