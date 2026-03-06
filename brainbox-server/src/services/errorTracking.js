const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');
const logger = require('../utils/logger');

class ErrorTrackingService {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          new ProfilingIntegration(),
          new Sentry.Integrations.Http({ tracing: true }),
          new Sentry.Integrations.Express({ app: require('express') }),
        ],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        environment: process.env.NODE_ENV,
        release: `brainbox@${process.env.npm_package_version}`,
      });
    }
  }

  // Capture exception with context
  captureException(error, context = {}) {
    logger.error('Error captured:', { error, context });
    
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        contexts: {
          additional: context
        }
      });
    }

    // Store error in database for analysis
    this.storeError(error, context);
  }

  // Capture message
  captureMessage(message, level = 'info') {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, level);
    }
  }

  // Set user context
  setUser(user) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.username
      });
    }
  }

  // Clear user context
  clearUser() {
    if (process.env.NODE_ENV === 'production') {
      Sentry.setUser(null);
    }
  }

  // Add breadcrumb
  addBreadcrumb(breadcrumb) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.addBreadcrumb(breadcrumb);
    }
  }

  // Start transaction
  startTransaction(name, op) {
    if (process.env.NODE_ENV === 'production') {
      return Sentry.startTransaction({
        name,
        op
      });
    }
    return null;
  }

  // Store error in database for analysis
  async storeError(error, context) {
    try {
      const Error = require('mongoose').model('Error');
      const errorDoc = new Error({
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        statusCode: error.statusCode,
        context,
        timestamp: new Date(),
        environment: process.env.NODE_ENV
      });
      await errorDoc.save();
    } catch (dbError) {
      logger.error('Failed to store error in database:', dbError);
    }
  }

  // Get error statistics
  async getErrorStats(timeRange = '24h') {
    const Error = require('mongoose').model('Error');
    const hours = timeRange === '24h' ? 24 : 168; // 24 hours or 7 days
    
    const stats = await Error.aggregate([
      {
        $match: {
          timestamp: { $gt: new Date(Date.now() - hours * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            name: '$name',
            hour: { $hour: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return stats;
  }
}

module.exports = new ErrorTrackingService();
