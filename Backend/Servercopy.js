require('dotenv').config({ path: './auth.env' });
require('dotenv').config(); // Fallback for standard .env or platform environment variables

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error(`❌ FATAL: Missing required environment variables in production: ${missingEnvVars.join(', ')}`);
  process.exit(1);
} else if (missingEnvVars.length > 0) {
  console.warn(`⚠️ Warning: Missing environment variables: ${missingEnvVars.join(', ')}. Default fallbacks will be used where applicable.`);
}

const app = require('./app');
const { connectToMongoDB } = require('./config/db');

const PORT = process.env.PORT || 5500;

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
  });
}).catch((err) => {
  console.error("❌ Failed to start server due to DB connection failure:", err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
