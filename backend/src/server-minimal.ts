import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3001');

// Basic middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Lethimdo API',
    version: '1.0.0',
    status: 'running'
  });
});

// Basic API routes placeholders
app.get('/api/auth/me', (req, res) => {
  res.json({ user: null, message: 'Not authenticated' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: false, message: 'Login endpoint placeholder' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ success: false, message: 'Register endpoint placeholder' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Lethimdo API server running on port ${port}`);
  console.log(`📊 Dashboard: http://localhost:${port}`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
});

export default app;