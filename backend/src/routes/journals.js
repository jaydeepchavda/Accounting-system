import express from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal
} from '../controllers/journalController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/',
  body('journalDate').isISO8601(),
  body('description').trim().notEmpty(),
  body('entries').isArray({ min: 1 }),
  createJournal
);

router.get('/', getJournals);

router.get('/:id', getJournalById);

router.put('/:id',
  body('journalDate').optional().isISO8601(),
  body('description').optional().trim(),
  updateJournal
);

router.delete('/:id', deleteJournal);

export default router;
