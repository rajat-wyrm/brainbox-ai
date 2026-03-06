const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class AlertService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.alertThresholds = {
      errorRate: 10, // errors per minute
      responseTime: 5000, // ms
      cpuUsage: 80, // percent
      memoryUsage: 512 * 1024 * 1024 // 512MB
    };

    this.alertHistory = [];
  }

  // Send email alert
  async sendEmailAlert(subject, message, level = 'warning') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ALERT_EMAIL || 'admin@brainbox.ai',
        subject: `[${level.toUpperCase()}] BrainBox AI - ${subject}`,
        html: `
          <h2>BrainBox AI Alert</h2>
          <p><strong>Level:</strong> ${level}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Message:</strong> ${message}</p>
          <hr>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
          <p><strong>Server:</strong> ${require('os').hostname()}</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Alert email sent: ${subject}`);
    } catch (error) {
      logger.error('Failed to send alert email:', error);
    }
  }

  // Send Slack alert
  async sendSlackAlert(subject, message, level = 'warning') {
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (!webhookUrl) return;

      const color = level === 'error' ? 'danger' : level === 'warning' ? 'warning' : 'good';

      const payload = {
        attachments: [{
          color,
          title: subject,
          text: message,
          fields: [
            {
              title: 'Environment',
              value: process.env.NODE_ENV,
              short: true
            },
            {
              title: 'Time',
              value: new Date().toISOString(),
              short: true
            }
          ],
          footer: 'BrainBox AI Monitoring',
          ts: Math.floor(Date.now() / 1000)
        }]
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      logger.info(`Slack alert sent: ${subject}`);
    } catch (error) {
      logger.error('Failed to send Slack alert:', error);
    }
  }

  // Check metrics and trigger alerts
  async checkMetrics(metrics) {
    const alerts = [];

    // Check error rate
    if (metrics.errorRate > this.alertThresholds.errorRate) {
      alerts.push({
        level: 'error',
        subject: 'High Error Rate Detected',
        message: `Error rate is ${metrics.errorRate} per minute (threshold: ${this.alertThresholds.errorRate})`
      });
    }

    // Check response time
    if (metrics.avgResponseTime > this.alertThresholds.responseTime) {
      alerts.push({
        level: 'warning',
        subject: 'High Response Time',
        message: `Average response time is ${metrics.avgResponseTime}ms (threshold: ${this.alertThresholds.responseTime}ms)`
      });
    }

    // Check CPU usage
    if (metrics.cpuUsage > this.alertThresholds.cpuUsage) {
      alerts.push({
        level: 'warning',
        subject: 'High CPU Usage',
        message: `CPU usage is ${metrics.cpuUsage}% (threshold: ${this.alertThresholds.cpuUsage}%)`
      });
    }

    // Check memory usage
    if (metrics.memoryUsage > this.alertThresholds.memoryUsage) {
      alerts.push({
        level: 'warning',
        subject: 'High Memory Usage',
        message: `Memory usage is ${Math.round(metrics.memoryUsage / 1024 / 1024)}MB (threshold: ${Math.round(this.alertThresholds.memoryUsage / 1024 / 1024)}MB)`
      });
    }

    // Send alerts
    for (const alert of alerts) {
      // Check if similar alert was sent recently (deduplication)
      const recent = this.alertHistory.find(a => 
        a.subject === alert.subject && 
        Date.now() - a.timestamp < 15 * 60 * 1000 // 15 minutes
      );

      if (!recent) {
        await this.sendEmailAlert(alert.subject, alert.message, alert.level);
        await this.sendSlackAlert(alert.subject, alert.message, alert.level);
        
        this.alertHistory.push({
          ...alert,
          timestamp: Date.now()
        });

        // Keep only last 100 alerts
        if (this.alertHistory.length > 100) {
          this.alertHistory.shift();
        }
      }
    }
  }

  // Schedule periodic health checks
  startHealthChecks() {
    const cron = require('node-cron');
    
    // Check every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      try {
        const metrics = {
          errorRate: await this.calculateErrorRate(),
          avgResponseTime: await this.calculateAvgResponseTime(),
          cpuUsage: process.cpuUsage().user / 1000000,
          memoryUsage: process.memoryUsage().rss
        };

        await this.checkMetrics(metrics);
      } catch (error) {
        logger.error('Health check failed:', error);
      }
    });
  }

  // Calculate error rate (errors per minute)
  async calculateErrorRate() {
    const Error = require('mongoose').model('Error');
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    const count = await Error.countDocuments({
      timestamp: { $gt: oneMinuteAgo }
    });

    return count;
  }

  // Calculate average response time
  async calculateAvgResponseTime() {
    // This would need to be implemented with your metrics service
    return 0;
  }
}

module.exports = new AlertService();
