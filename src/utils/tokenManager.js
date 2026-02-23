import jwt from 'jsonwebtoken';

// Validasi environment variables
if (!process.env.ACCESS_TOKEN_KEY) {
  throw new Error('ACCESS_TOKEN_KEY tidak ditemukan di environment variable');
}

if (!process.env.REFRESH_TOKEN_KEY) {
  throw new Error('REFRESH_TOKEN_KEY tidak ditemukan di environment variable');
}

const TokenManager = {
  generateAccessToken: (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_AGE || '1800s',
    }),

  generateRefreshToken: (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_AGE || '7d',
    }),

  verifyAccessToken: (token) =>
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY),

  verifyRefreshToken: (token) =>
    jwt.verify(token, process.env.REFRESH_TOKEN_KEY),
};

export default TokenManager;
