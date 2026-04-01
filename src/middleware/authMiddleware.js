import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// @desc    Verify JWT token and attach user to request
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const tokenError = new Error('No token provided. Please login first.');
      tokenError.statusCode = 401;
      return next(tokenError);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      const userError = new Error('User not found');
      userError.statusCode = 401;
      return next(userError);
    }

    if (!user.isActive) {
      const inactiveError = new Error('User account is inactive');
      inactiveError.statusCode = 403;
      return next(inactiveError);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
