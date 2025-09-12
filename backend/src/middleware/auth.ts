import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from './errorHandler';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    subscriptionTier: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      throw new AuthenticationError('Invalid token format');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not configured');
      throw new Error('Server configuration error');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      subscriptionTier: decoded.subscriptionTier,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

export const requireSubscription = (requiredTier: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    const tierLevels = {
      'free': 0,
      'starter': 1,
      'pro': 2,
      'business': 3,
    };

    const userLevel = tierLevels[req.user.subscriptionTier as keyof typeof tierLevels] || 0;
    const requiredLevel = tierLevels[requiredTier as keyof typeof tierLevels] || 0;

    if (userLevel < requiredLevel) {
      return next(new AuthorizationError(`${requiredTier} subscription required`));
    }

    next();
  };
};

export const generateToken = (user: { id: string; email: string; subscriptionTier: string }): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

export const refreshToken = (token: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Generate new token with same payload
    return generateToken({
      id: decoded.id,
      email: decoded.email,
      subscriptionTier: decoded.subscriptionTier,
    });
  } catch (error) {
    throw new AuthenticationError('Invalid token for refresh');
  }
};