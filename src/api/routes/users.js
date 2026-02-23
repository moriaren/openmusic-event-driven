import express from 'express';
import UsersHandler from '../handlers/UsersHandler.js';

const router = express.Router();

router.post('/', UsersHandler.postUserHandler);

export default router;
