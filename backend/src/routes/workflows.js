import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getJournalWorkflows,
  approveJournal,
  rejectJournal,
  submitJournalForApproval,
  getWorkflowHistory
} from '../controllers/workflowController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getJournalWorkflows);

router.post('/:id/submit', submitJournalForApproval);

router.post('/:id/approve', approveJournal);

router.post('/:id/reject', rejectJournal);

router.get('/:id/history', getWorkflowHistory);

export default router;
