const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();
const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('? MongoDB Connected');
  } catch (err) {
    console.log('? MongoDB Connection Error:', err.message);
    console.log('?? Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Info
app.get('/', (req, res) => {
  res.json({
    name: 'BrainBox AI API',
    version: '2.0.0',
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`?? BrainBox AI Server v2.0.0`);
  console.log('='.repeat(60));
  console.log(`?? URL: http://localhost:${PORT}`);
  console.log(`?? Health: http://localhost:${PORT}/health`);
  console.log(`?? Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60) + '\n');
});
