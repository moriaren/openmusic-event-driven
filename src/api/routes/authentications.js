import express from 'express';
import AuthenticationsHandler from '../handlers/AuthenticationsHandler.js';
import UsersService from '../../services/UsersService.js';
import AuthenticationsService from '../../services/AuthenticationsService.js';
import TokenManager from '../../utils/tokenManager.js';

const router = express.Router();

// Instantiate services
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();

// Create handler with DI
const authenticationsHandler = new AuthenticationsHandler(
  usersService,
  authenticationsService,
  TokenManager
);

// Routes
router.post('/', authenticationsHandler.postAuthenticationHandler);
router.put('/', authenticationsHandler.putAuthenticationHandler);
router.delete('/', authenticationsHandler.deleteAuthenticationHandler);

export default router;
