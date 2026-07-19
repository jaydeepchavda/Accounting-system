import express from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import {
  createBudget,
  getBudgets,
  getBudgetById,
  getBudgetVariance
} from '../controllers/budgetController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/',
  body('budgetPeriod').notEmpty(),
  body('budgetYear').isInt(),
  body('accounts').isArray({ min: 1 }),
  createBudget
);

router.get('/', getBudgets);

router.get('/:id', getBudgetById);

router.get('/:id/variance', getBudgetVariance);

export default router;
