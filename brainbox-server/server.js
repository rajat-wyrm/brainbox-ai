const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Import configs and utilities
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');
const { errorHandler } = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');

// Initialize app
const app = express();
const server = http.createServer(app);

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000']
    }
  }
}));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Compress responses
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// ============================================
# LOGGING MIDDLEWARE
# ============================================

// Create logs directory if it doesn't exist
if (!fs.existsSync(process.env.LOG_DIR || 'logs')) {
  fs.mkdirSync(process.env.LOG_DIR || 'logs', { recursive: true });
}

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: logger.stream }));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Custom request logger
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// ============================================
# DATABASE CONNECTION
# ============================================
connectDB();

// ============================================
# API ROUTES
# ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BrainBox AI Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  });
});

// API info
app.get('/', (req, res) => {
  res.json({
    name: 'BrainBox AI API',
    version: '3.0.0',
    description: 'Enterprise Grade Learning Platform',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api-docs',
    status: 'operational',
    endpoints: {
      auth: {
        signup: 'POST /api/v1/auth/signup',
        login: 'POST /api/v1/auth/login',
        logout: 'POST /api/v1/auth/logout',
        me: 'GET /api/v1/auth/me',
        updateProfile: 'PATCH /api/v1/auth/update-profile',
        updatePassword: 'PATCH /api/v1/auth/update-password',
        forgotPassword: 'POST /api/v1/auth/forgot-password',
        resetPassword: 'PATCH /api/v1/auth/reset-password/:token',
        deleteAccount: 'DELETE /api/v1/auth/delete-account'
      }
    }
  });
});

// Mount routes
app.use('/api/v1/auth', authRoutes);

// ============================================
# SOCKET.IO (Real-time features)
# ============================================

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

io.on('connection', (socket) => {
  logger.info(`🔌 Client connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    logger.info(`📦 Socket ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    logger.info(`📦 Socket ${socket.id} left room: ${roomId}`);
    socket.to(roomId).emit('user-left', { userId: socket.id });
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('new-message', {
      ...data,
      userId: socket.id,
      timestamp: new Date()
    });
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user-typing', {
      userId: socket.id,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    logger.info(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// ============================================
# STATIC FILES (for uploads)
# ============================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
# 404 HANDLER
# ============================================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// ============================================
# ERROR HANDLING MIDDLEWARE
# ============================================
app.use(errorHandler);

// ============================================
# START SERVER
# ============================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 BRAINBOX AI SERVER v3.0.0');
  console.log('='.repeat(60));
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔧 Health: http://localhost:${PORT}/health`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔄 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('='.repeat(60) + '\n');

  logger.info(`🚀 Server started on port ${PORT}`);
  logger.info(`📡 WebSocket server ready`);
});

// ============================================
# GRACEFUL SHUTDOWN
# ============================================
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('💤 Server closed');
    mongoose.connection.close(false, () => {
      logger.info('💤 Database connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('👋 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('💤 Server closed');
    mongoose.connection.close(false, () => {
      logger.info('💤 Database connection closed');
      process.exit(0);
    });
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = { app, server, io };

// Metrics endpoint
app.get('/metrics', metricsService.getMetricsHandler());

// Detailed health check
app.get('/health/detailed', metricsService.getHealthHandler());

// Debug endpoint (only in development)
if (process.env.NODE_ENV === 'development') {
  app.get('/debug/logs', (req, res) => {
    res.json(debugLogger.getRecentLogs(parseInt(req.query.limit) || 100));
  });

  app.get('/debug/errors', async (req, res) => {
    const errors = await Error.getRecentErrors(parseInt(req.query.hours) || 24);
    res.json(errors);
  });
}

// Error tracking middleware
app.use(debugLogger.requestLogger());
app.use(debugLogger.errorLogger());

// Track active users
app.use((req, res, next) => {
  if (req.user) {
    metricsService.updateActiveUsers(1);
  }
  next();
});
