const logger = require('./logger');

class DebugLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  // Log debug info
  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      stack: new Error().stack
    };

    this.logs.unshift(logEntry);
    
    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Also log to file
    logger.log(level, message, data);
  }

  // Get recent logs
  getRecentLogs(limit = 100) {
    return this.logs.slice(0, limit);
  }

  // Get logs by level
  getLogsByLevel(level, limit = 100) {
    return this.logs.filter(log => log.level === level).slice(0, limit);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  // Middleware for request logging
  requestLogger() {
    return (req, res, next) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        
        this.log('info', 'HTTP Request', {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration,
          ip: req.ip,
          userAgent: req.get('user-agent')
        });
      });

      next();
    };
  }

  // Middleware for error logging
  errorLogger() {
    return (err, req, res, next) => {
      this.log('error', err.message, {
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack
        },
        request: {
          method: req.method,
          url: req.url,
          body: req.body,
          params: req.params,
          query: req.query,
          headers: req.headers
        }
      });

      next(err);
    };
  }
}

module.exports = new DebugLogger();
