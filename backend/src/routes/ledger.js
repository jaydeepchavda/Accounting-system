import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getLedger,
  getTrialBalance,
  getAccountLedgerSummary
} from '../controllers/ledgerController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/trial-balance', getTrialBalance);

router.get('/summary', getAccountLedgerSummary);

router.get('/:accountId', getLedger);

export default router;
