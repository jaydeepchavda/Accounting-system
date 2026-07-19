import { query } from '../config/database.js';

export const getJournalWorkflows = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query_text = `
      SELECT je.id, je.journal_date, je.description, je.status as approval_status,
             u.email as created_by_email, je.created_at
      FROM journal_entries je
      JOIN users u ON je.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query_text += ` AND je.status = $${params.length + 1}`;
      params.push(status);
    }

    query_text += ` ORDER BY je.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, (page - 1) * limit);

    const result = await query(query_text, params);

    res.json({
      data: result.rows,
      pagination: { page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const approveJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { notes } = req.body;

    // Get journal
    const journalResult = await query(
      'SELECT id, status FROM journal_entries WHERE id = $1',
      [id]
    );

    if (journalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (journalResult.rows[0].status !== 'pending') {
      return res.status(400).json({ error: 'Only pending journals can be approved' });
    }

    // Update journal status
    await query(
      'UPDATE journal_entries SET status = $1, approved_by = $2, approved_at = NOW() WHERE id = $3',
      ['approved', userId, id]
    );

    // Post entries
    await query(
      `INSERT INTO postings (journal_id, account_id, debit, credit)
       SELECT journal_id, account_id, debit, credit
       FROM journal_line_items
       WHERE journal_id = $1`,
      [id]
    );

    // Record workflow action
    await query(
      `INSERT INTO workflow_actions (journal_id, action_type, performed_by, notes)
       VALUES ($1, $2, $3, $4)`,
      [id, 'approved', userId, notes || null]
    );

    res.json({ message: 'Journal approved and posted successfully' });
  } catch (error) {
    next(error);
  }
};

export const rejectJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { notes } = req.body;

    // Get journal
    const journalResult = await query(
      'SELECT id, status FROM journal_entries WHERE id = $1',
      [id]
    );

    if (journalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (journalResult.rows[0].status !== 'pending') {
      return res.status(400).json({ error: 'Only pending journals can be rejected' });
    }

    // Update journal status back to draft
    await query(
      'UPDATE journal_entries SET status = $1, rejected_by = $2, rejected_at = NOW() WHERE id = $3',
      ['draft', userId, id]
    );

    // Record workflow action
    await query(
      `INSERT INTO workflow_actions (journal_id, action_type, performed_by, notes)
       VALUES ($1, $2, $3, $4)`,
      [id, 'rejected', userId, notes || null]
    );

    res.json({ message: 'Journal rejected and returned to draft' });
  } catch (error) {
    next(error);
  }
};

export const submitJournalForApproval = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get journal
    const journalResult = await query(
      'SELECT id, status FROM journal_entries WHERE id = $1',
      [id]
    );

    if (journalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (journalResult.rows[0].status !== 'draft') {
      return res.status(400).json({ error: 'Only draft journals can be submitted' });
    }

    // Validate journal entries balance
    const balanceCheck = await query(
      `SELECT SUM(CASE WHEN debit IS NOT NULL THEN debit ELSE 0 END) as total_debit,
              SUM(CASE WHEN credit IS NOT NULL THEN credit ELSE 0 END) as total_credit
       FROM journal_line_items
       WHERE journal_id = $1`,
      [id]
    );

    const row = balanceCheck.rows[0];
    const totalDebit = parseFloat(row.total_debit) || 0;
    const totalCredit = parseFloat(row.total_credit) || 0;

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({ error: 'Journal entries do not balance' });
    }

    // Update status to pending
    await query(
      'UPDATE journal_entries SET status = $1, submitted_at = NOW() WHERE id = $2',
      ['pending', id]
    );

    res.json({ message: 'Journal submitted for approval' });
  } catch (error) {
    next(error);
  }
};

export const getWorkflowHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT wa.id, wa.action_type, wa.performed_by, u.email, wa.notes, wa.created_at
       FROM workflow_actions wa
       JOIN users u ON wa.performed_by = u.id
       WHERE wa.journal_id = $1
       ORDER BY wa.created_at DESC`,
      [id]
    );

    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};
