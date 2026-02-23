import TokenManager from '../../utils/tokenManager.js';
import AuthenticationError from '../../exceptions/AuthenticationError.js';

const authentication = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new AuthenticationError('Access token tidak ditemukan');
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new AuthenticationError('Format authorization salah');
    }

    const token = authorization.split(' ')[1];

    const { userId } = TokenManager.verifyAccessToken(token);

    // WAJIB format seperti ini untuk handler
    req.user = { id: userId };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Access token expired'));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Invalid token'));
    }

    return next(error);
  }
};

export default authentication;
