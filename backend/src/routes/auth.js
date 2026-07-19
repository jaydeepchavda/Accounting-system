import express from 'express';
import { body } from 'express-validator';
import { register, login, refresh, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty(),
  register
);

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  login
);

router.post('/refresh',
  body('refreshToken').notEmpty(),
  refresh
);

router.post('/logout', logout);

export default router;
