import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { DatabaseService } from '../services/databaseService';
import { generateToken, refreshToken } from '../middleware/auth';
import { ValidationError, AuthenticationError, ConflictError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Register endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { email, password, name } = req.body;
  const pool = DatabaseService.getPool();

  // Check if user already exists
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));

  // Create user
  const result = await pool.query(
    `INSERT INTO users (email, name, password_hash, subscription_tier, preferences, business_profile) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, email, name, subscription_tier, created_at`,
    [
      email,
      name,
      passwordHash,
      'free',
      {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          slack: false
        },
        dashboard: {
          defaultPeriod: 'month',
          defaultCharts: ['time-savings', 'cost-savings']
        }
      },
      {
        industry: '',
        companySize: '',
        currentTools: [],
        painPoints: [],
        goals: []
      }
    ]
  );

  const user = result.rows[0];
  const token = generateToken({
    id: user.id,
    email: user.email,
    subscriptionTier: user.subscription_tier
  });

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscription_tier,
        createdAt: user.created_at
      },
      token
    },
    message: 'User registered successfully'
  });
}));

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { email, password } = req.body;
  const pool = DatabaseService.getPool();

  // Find user
  const result = await pool.query(
    'SELECT id, email, name, password_hash, subscription_tier, subscription_expiry FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new AuthenticationError('Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    subscriptionTier: user.subscription_tier
  });

  logger.info(`User logged in: ${email}`);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscription_tier,
        subscriptionExpiry: user.subscription_expiry
      },
      token
    },
    message: 'Login successful'
  });
}));

// Refresh token endpoint
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  
  if (!token) {
    throw new ValidationError('Token is required');
  }

  try {
    const newToken = refreshToken(token);
    
    res.json({
      success: true,
      data: { token: newToken },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
}));

// Get current user profile
router.get('/me', async (req: any, res: Response) => {
  const pool = DatabaseService.getPool();
  
  const result = await pool.query(
    `SELECT id, email, name, subscription_tier, subscription_expiry, 
            preferences, business_profile, created_at 
     FROM users WHERE id = $1`,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    throw new AuthenticationError('User not found');
  }

  const user = result.rows[0];

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscription_tier,
        subscriptionExpiry: user.subscription_expiry,
        preferences: user.preferences,
        businessProfile: user.business_profile,
        createdAt: user.created_at
      }
    }
  });
});

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('businessProfile').optional().isObject(),
  body('preferences').optional().isObject(),
], asyncHandler(async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { name, businessProfile, preferences } = req.body;
  const pool = DatabaseService.getPool();

  const updateFields = [];
  const updateValues = [];
  let paramCount = 1;

  if (name) {
    updateFields.push(`name = $${paramCount}`);
    updateValues.push(name);
    paramCount++;
  }

  if (businessProfile) {
    updateFields.push(`business_profile = $${paramCount}`);
    updateValues.push(JSON.stringify(businessProfile));
    paramCount++;
  }

  if (preferences) {
    updateFields.push(`preferences = $${paramCount}`);
    updateValues.push(JSON.stringify(preferences));
    paramCount++;
  }

  updateFields.push(`updated_at = NOW()`);
  updateValues.push(req.user.id);

  const query = `
    UPDATE users 
    SET ${updateFields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, email, name, subscription_tier, preferences, business_profile
  `;

  const result = await pool.query(query, updateValues);
  const user = result.rows[0];

  res.json({
    success: true,
    data: { user },
    message: 'Profile updated successfully'
  });
}));

// Logout endpoint (mainly for logging purposes)
router.post('/logout', asyncHandler(async (req: any, res: Response) => {
  logger.info(`User logged out: ${req.user?.email || 'unknown'}`);
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

export default router;