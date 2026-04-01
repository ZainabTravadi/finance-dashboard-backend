import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import {
  registerSchema,
  loginSchema,
  validateBody,
} from '../utils/validationSchemas.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { error, value } = validateBody(registerSchema, req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const { name, email, password } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const conflictError = new Error('Email already registered');
      conflictError.statusCode = 400;
      return next(conflictError);
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    // Return response without password
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { error, value } = validateBody(loginSchema, req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const { email, password } = value;

    // Find user and include password (since it's normally excluded)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      const credentialsError = new Error('Invalid credentials');
      credentialsError.statusCode = 401;
      return next(credentialsError);
    }

    // Check if user is active
    if (!user.isActive) {
      const inactiveError = new Error('User account is inactive');
      inactiveError.statusCode = 403;
      return next(inactiveError);
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      const credentialsError = new Error('Invalid credentials');
      credentialsError.statusCode = 401;
      return next(credentialsError);
    }

    // Generate token
    const token = generateToken(user._id);

    // Return response without password
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
