const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./modules/auth/authRoutes');
const userRoutes = require('./modules/user/userRoutes');
const attendanceRoutes = require("./modules/attendanceCopy/attendance.routes");
const payrollroutes = require('./modules/payroll/payrollroutes');
const calendar = require('./modules/calendar/holidayRoutes');
const mailroutes = require('./modules/mail/mailroutes');
const cloudinaryroutes = require('./modules/cloudinary/cloudinaryroutes');
const leaveRoutes = require('./modules/leave/leaveRoutes');
const salaryStructureRoutes = require('./modules/salaryStructure/salaryStructureRoutes');
const contactHRRoutes = require('./modules/contactwithHR/contectHRRoutes');
const aiRoutes = require('./modules/ai/aiRoutes');

const { getDB } = require('./config/db');

const app = express();

// ✅ Configure Production-Ready CORS
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dayflow-hrms-smoky.vercel.app'
];
const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      /\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser & cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logger
app.use((req, res, next) => {
  console.log(`[📥 ${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoints
const handleHealthCheck = (req, res) => {
  const db = getDB();
  const isDbConnected = !!db;
  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    status: isDbConnected ? 'healthy' : 'degraded',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: isDbConnected ? 'connected' : 'disconnected'
  });
};

app.get('/health', handleHealthCheck);
app.get('/api/health', handleHealthCheck);

// Mount API routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', leaveRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', payrollroutes);
app.use('/api', calendar);
app.use('/api', mailroutes);
app.use('/api', cloudinaryroutes);
app.use('/api', salaryStructureRoutes);
app.use('/api/contact-hr', contactHRRoutes);
app.use('/api/ai', aiRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
