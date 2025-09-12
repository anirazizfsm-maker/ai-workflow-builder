import request from 'supertest';
import express from 'express';
import authRoutes from '../../../routes/auth';
import { DatabaseService } from '../../../services/databaseService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../../services/databaseService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockDatabaseService = DatabaseService as jest.Mocked<typeof DatabaseService>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

// Create Express app for testing
const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRoutes);
  return app;
};

describe('Auth Routes', () => {
  let app: express.Application;
  let mockPool: any;

  beforeEach(() => {
    app = createApp();
    mockPool = {
      query: jest.fn(),
    };
    mockDatabaseService.getPool.mockReturnValue(mockPool);
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock database responses
      mockPool.query
        .mockResolvedValueOnce({ rows: [] }) // Check if user exists
        .mockResolvedValueOnce({ // Insert new user
          rows: [{
            id: 'user123',
            name: 'John Doe',
            email: 'john@example.com',
            created_at: new Date(),
          }]
        });

      // Mock bcrypt
      mockBcrypt.hash.mockResolvedValue('hashedPassword123');
      
      // Mock JWT
      mockJwt.sign.mockReturnValue('mockToken123');

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBe('mockToken123');
      expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
    });

    it('should return 409 if user already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock existing user
      mockPool.query.mockResolvedValueOnce({ 
        rows: [{ id: 'existingUser', email: 'john@example.com' }] 
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('valid email');
    });

    it('should validate password length', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('6 characters');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user with correct credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword123',
        subscription_tier: 'free',
        created_at: new Date(),
      };

      // Mock database response
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });
      
      // Mock bcrypt compare
      mockBcrypt.compare.mockResolvedValue(true);
      
      // Mock JWT
      mockJwt.sign.mockReturnValue('mockToken123');

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBe('mockToken123');
      expect(mockBcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    });

    it('should return 401 for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // Mock no user found
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should return 401 for incorrect password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 'user123',
        email: 'john@example.com',
        password: 'hashedPassword123',
      };

      // Mock database response
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });
      
      // Mock bcrypt compare to return false
      mockBcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });
  });

  describe('GET /auth/me', () => {
    it('should return user profile with valid token', async () => {
      const mockUser = {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        subscription_tier: 'pro',
        created_at: new Date(),
      };

      // Mock JWT verification
      mockJwt.verify.mockReturnValue({ id: 'user123', email: 'john@example.com' });
      
      // Mock database response
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer validToken123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(mockUser.email);
      expect(response.body.data.user.subscriptionTier).toBe(mockUser.subscription_tier);
    });

    it('should return 401 without authorization header', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Authorization header');
    });

    it('should return 401 with invalid token', async () => {
      // Mock JWT verification to throw error
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalidToken')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid token');
    });
  });

  describe('PUT /auth/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'John Updated',
        businessProfile: {
          industry: 'technology',
          companySize: '11-50',
        },
      };

      const mockUser = {
        id: 'user123',
        name: 'John Updated',
        email: 'john@example.com',
      };

      // Mock JWT verification
      mockJwt.verify.mockReturnValue({ id: 'user123', email: 'john@example.com' });
      
      // Mock database update
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', 'Bearer validToken123')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put('/auth/profile')
        .send({ name: 'New Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});", "original_text": "", "replace_all": false}