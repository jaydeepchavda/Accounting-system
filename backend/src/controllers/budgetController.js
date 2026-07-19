import { query } from '../config/database.js';
import { validationResult } from 'express-validator';

export const createBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { budgetPeriod, budgetYear, accounts } = req.body;
    const userId = req.user.userId;

    // Create budget header
    const budgetResult = await query(
      `INSERT INTO budgets (budget_period, budget_year, created_by) 
       VALUES ($1, $2, $3) 
       RETURNING id, budget_period, budget_year, created_at`,
      [budgetPeriod, budgetYear, userId]
    );

    const budget = budgetResult.rows[0];
    const budgetId = budget.id;

    // Add budget accounts
    if (accounts && accounts.length > 0) {
      const budgetAccounts = [];
      for (const account of accounts) {
        const accountResult = await query(
          `INSERT INTO budget_accounts (budget_id, account_id, budgeted_amount) 
           VALUES ($1, $2, $3) 
           RETURNING id, account_id, budgeted_amount`,
          [budgetId, account.accountId, account.budgetedAmount]
        );
        budgetAccounts.push(accountResult.rows[0]);
      }
      budget.accounts = budgetAccounts;
    }

    res.status(201).json({
      message: 'Budget created successfully',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgets = async (req, res, next) => {
  try {
    const { budgetYear, page = 1, limit = 10 } = req.query;

    let query_text = `
      SELECT id, budget_period, budget_year, created_by, created_at 
      FROM budgets WHERE 1=1
    `;
    const params = [];

    if (budgetYear) {
      query_text += ` AND budget_year = $${params.length + 1}`;
      params.push(budgetYear);
    }

    query_text += ` ORDER BY budget_year DESC, created_at DESC 
                   LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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

export const getBudgetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const budgetResult = await query(
      'SELECT id, budget_period, budget_year, created_by, created_at FROM budgets WHERE id = $1',
      [id]
    );

    if (budgetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const budget = budgetResult.rows[0];

    const accountsResult = await query(
      `SELECT ba.id, ba.account_id, ba.budgeted_amount, a.account_number, a.account_name 
       FROM budget_accounts ba
       JOIN accounts a ON ba.account_id = a.id
       WHERE ba.budget_id = $1`,
      [id]
    );

    budget.accounts = accountsResult.rows;

    res.json({ data: budget });
  } catch (error) {
    next(error);
  }
};

export const getBudgetVariance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Get budget
    const budgetResult = await query(
      'SELECT id, budget_period, budget_year FROM budgets WHERE id = $1',
      [id]
    );

    if (budgetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const budget = budgetResult.rows[0];

    // Get variance
    const varianceResult = await query(
      `SELECT ba.account_id, a.account_number, a.account_name, 
              ba.budgeted_amount,
              COALESCE(SUM(CASE WHEN pl.debit IS NOT NULL THEN pl.debit ELSE 0 END), 0) as actual_debit,
              COALESCE(SUM(CASE WHEN pl.credit IS NOT NULL THEN pl.credit ELSE 0 END), 0) as actual_credit
       FROM budget_accounts ba
       JOIN accounts a ON ba.account_id = a.id
       LEFT JOIN postings pl ON ba.account_id = pl.account_id
       LEFT JOIN journal_entries je ON pl.journal_id = je.id AND je.status = 'posted'
       WHERE ba.budget_id = $1
       ${startDate ? 'AND je.journal_date >= $2' : ''}
       ${endDate ? (startDate ? 'AND je.journal_date <= $3' : 'AND je.journal_date <= $2') : ''}
       GROUP BY ba.account_id, ba.budgeted_amount, a.account_number, a.account_name`,
      startDate && endDate ? [id, startDate, endDate] : 
      startDate ? [id, startDate] : 
      endDate ? [id, endDate] : 
      [id]
    );

    let totalBudgeted = 0;
    let totalActual = 0;

    const variances = varianceResult.rows.map(row => {
      const budgeted = parseFloat(row.budgeted_amount) || 0;
      const actual = (parseFloat(row.actual_debit) || 0) - (parseFloat(row.actual_credit) || 0);
      const variance = budgeted - actual;
      const variancePercent = budgeted !== 0 ? (variance / budgeted) * 100 : 0;

      totalBudgeted += budgeted;
      totalActual += actual;

      return {
        accountNumber: row.account_number,
        accountName: row.account_name,
        budgetedAmount: budgeted,
        actualAmount: actual,
        variance,
        variancePercent: variancePercent.toFixed(2)
      };
    });

    res.json({
      budget,
      variances,
      summary: {
        totalBudgeted,
        totalActual,
        totalVariance: totalBudgeted - totalActual
      }
    });
  } catch (error) {
    next(error);
  }
};
