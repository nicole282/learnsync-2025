import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Validate user registration data
 */
export const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = {};

  // Validate username
  if (!username || username.trim().length === 0) {
    errors.username = '请输入用户名';
  } else if (username.length < VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH) {
    errors.username = `用户名至少需要${VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH}个字符`;
  } else if (username.length > VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH) {
    errors.username = `用户名不能超过${VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH}个字符`;
  } else if (!VALIDATION_CONSTANTS.USERNAME.PATTERN.test(username)) {
    errors.username = ERROR_MESSAGES.INVALID_USERNAME;
  }

  // Validate email
  if (!email || email.trim().length === 0) {
    errors.email = '请输入邮箱地址';
  } else if (email.length > VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH) {
    errors.email = `邮箱地址不能超过${VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH}个字符`;
  } else if (!VALIDATION_CONSTANTS.EMAIL.PATTERN.test(email)) {
    errors.email = ERROR_MESSAGES.INVALID_EMAIL;
  }

  // Validate password
  if (!password || password.length === 0) {
    errors.password = '请输入密码';
  } else if (password.length < VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH) {
    errors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  } else if (password.length > VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH) {
    errors.password = `密码不能超过${VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH}个字符`;
  }

  // If there are errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: '输入数据验证失败',
      details: errors
    });
  }

  // Sanitize data
  req.body.username = username.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validate user login data
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  // Validate email
  if (!email || email.trim().length === 0) {
    errors.email = '请输入邮箱地址';
  } else if (!VALIDATION_CONSTANTS.EMAIL.PATTERN.test(email)) {
    errors.email = ERROR_MESSAGES.INVALID_EMAIL;
  }

  // Validate password
  if (!password || password.length === 0) {
    errors.password = '请输入密码';
  }

  // If there are errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: '输入数据验证失败',
      details: errors
    });
  }

  // Sanitize email
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validate email format
 */
export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email || !VALIDATION_CONSTANTS.EMAIL.PATTERN.test(email)) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_EMAIL
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Validate user profile update data
 */
export const validateProfileUpdate = (req, res, next) => {
  const { username } = req.body;
  const errors = {};

  // Validate username if provided
  if (username && username.trim().length > 0) {
    if (username.length < VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH) {
      errors.username = `用户名至少需要${VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH}个字符`;
    } else if (username.length > VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH) {
      errors.username = `用户名不能超过${VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH}个字符`;
    } else if (!VALIDATION_CONSTANTS.USERNAME.PATTERN.test(username)) {
      errors.username = ERROR_MESSAGES.INVALID_USERNAME;
    } else {
      req.body.username = username.trim();
    }
  }

  // Remove any fields that shouldn't be updated
  delete req.body.password;
  delete req.body.email; // Email updates should be handled separately
  delete req.body.id;
  delete req.body.created_at;

  // If there are errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: '输入数据验证失败',
      details: errors
    });
  }

  next();
};

/**
 * Generic request validation middleware
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    // This can be extended with a proper validation library like Joi or Yup
    // For now, we're using the specific validators above
    next();
  };
};
