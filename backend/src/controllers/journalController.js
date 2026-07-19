import { query } from '../config/database.js';
import { validationResult } from 'express-validator';

export const createJournal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { journalDate, description, entries } = req.body;
    const userId = req.user.userId;

    // Create journal entry
    const result = await query(
      `INSERT INTO journal_entries (journal_date, description, created_by, status) 
       VALUES ($1, $2, $3, 'draft') 
       RETURNING id, journal_date, description, status, created_at`,
      [journalDate, description, userId]
    );

    const journal = result.rows[0];
    const journalId = journal.id;

    // Add line items
    if (entries && entries.length > 0) {
      const lineItems = [];
      for (const entry of entries) {
        const lineResult = await query(
          `INSERT INTO journal_line_items (journal_id, account_id, debit, credit, description) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING id, account_id, debit, credit`,
          [journalId, entry.accountId, entry.debit || 0, entry.credit || 0, entry.description]
        );
        lineItems.push(lineResult.rows[0]);
      }
      journal.lineItems = lineItems;
    }

    res.status(201).json({
      message: 'Journal entry created',
      data: journal
    });
  } catch (error) {
    next(error);
  }
};

export const getJournals = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query_text = 'SELECT id, journal_date, description, status, created_at FROM journal_entries WHERE 1=1';
    const params = [];

    if (status) {
      query_text += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query_text += ` ORDER BY journal_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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

export const getJournalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const journalResult = await query(
      'SELECT id, journal_date, description, status, created_at FROM journal_entries WHERE id = $1',
      [id]
    );

    if (journalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    const journal = journalResult.rows[0];

    const lineResult = await query(
      `SELECT id, account_id, debit, credit, description 
       FROM journal_line_items WHERE journal_id = $1`,
      [id]
    );

    journal.lineItems = lineResult.rows;

    res.json({ data: journal });
  } catch (error) {
    next(error);
  }
};

export const updateJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { journalDate, description, entries } = req.body;

    // Check if journal exists and is draft
    const journalCheck = await query(
      'SELECT status FROM journal_entries WHERE id = $1',
      [id]
    );

    if (journalCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (journalCheck.rows[0].status !== 'draft') {
      return res.status(400).json({ error: 'Can only edit draft journal entries' });
    }

    // Update journal
    await query(
      'UPDATE journal_entries SET journal_date = $1, description = $2 WHERE id = $3',
      [journalDate, description, id]
    );

    // Update line items
    if (entries && entries.length > 0) {
      await query('DELETE FROM journal_line_items WHERE journal_id = $1', [id]);
      
      for (const entry of entries) {
        await query(
          `INSERT INTO journal_line_items (journal_id, account_id, debit, credit, description) 
           VALUES ($1, $2, $3, $4, $5)`,
          [id, entry.accountId, entry.debit || 0, entry.credit || 0, entry.description]
        );
      }
    }

    res.json({ message: 'Journal entry updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteJournal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const journalCheck = await query(
      'SELECT status FROM journal_entries WHERE id = $1',
      [id]
    );

    if (journalCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (journalCheck.rows[0].status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete draft journal entries' });
    }

    await query('DELETE FROM journal_line_items WHERE journal_id = $1', [id]);
    await query('DELETE FROM journal_entries WHERE id = $1', [id]);

    res.json({ message: 'Journal entry deleted' });
  } catch (error) {
    next(error);
  }
};
