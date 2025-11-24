import { User } from '../models/User.js';
import { generateToken } from '../utils/token.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants.js';

/**
 * User registration controller
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: ERROR_MESSAGES.USER_EXISTS
      });
    }

    // Check if username is taken
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status
