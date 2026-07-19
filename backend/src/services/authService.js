import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiry
  });
};

export const generateTokenPair = (userId, email, role = 'user') => {
  const payload = { userId, email, role };
  const accessToken = generateToken(payload);
  
  // Refresh token with longer expiry
  const refreshToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: '30d'
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};
