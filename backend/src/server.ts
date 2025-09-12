import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth';
import workflowRoutes from './routes/workflows';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';
import integrationRoutes from './routes/integrations';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { logger } from './utils/logger';

// Import services
import { SocketService } from './services/socketService';
import { DatabaseService } from './services/databaseService';

// Load environment variables
dotenv.config();

class LethimboServer {
  private app: express.Application;
  private httpServer: any;
  private io: SocketIOServer;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001');
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocket();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging middleware
    this.app.use(morgan('combined', {
      stream: { write: (message: string) => logger.info(message.trim()) },
    }));
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/workflows', authMiddleware, workflowRoutes);
    this.app.use('/api/analytics', authMiddleware, analyticsRoutes);
    this.app.use('/api/ai', authMiddleware, aiRoutes);
    this.app.use('/api/integrations', authMiddleware, integrationRoutes);

    // Default route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Lethimdo API',
        version: '1.0.0',
        documentation: '/api/docs',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl,
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  private initializeSocket(): void {
    const socketService = new SocketService(this.io);
    socketService.initialize();
  }

  public async start(): Promise<void> {
    try {
      // Initialize database connection
      await DatabaseService.initialize();
      logger.info('Database connection established');

      // Start server
      this.httpServer.listen(this.port, () => {
        logger.info(`🚀 Lethimdo API server running on port ${this.port}`);
        logger.info(`📊 Dashboard: http://localhost:${this.port}`);
        logger.info(`🔍 Health check: http://localhost:${this.port}/health`);
        logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(): Promise<void> {
    logger.info('Received shutdown signal, starting graceful shutdown...');
    
    this.httpServer.close(async () => {
      try {
        await DatabaseService.close();
        logger.info('Database connection closed');
        logger.info('Server shut down gracefully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forcing shutdown...');
      process.exit(1);
    }, 10000);
  }
}

// Create and start server
const server = new LethimboServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default server;