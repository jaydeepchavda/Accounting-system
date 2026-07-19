import { query } from '../config/database.js';

export const getLedger = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { startDate, endDate, page = 1, limit = 20 } = req.query;

    let query_text = `
      SELECT pl.id, pl.journal_id, pl.account_id, pl.debit, pl.credit, 
             je.journal_date, je.description, a.account_number, a.account_name
      FROM postings pl
      JOIN journal_entries je ON pl.journal_id = je.id
      JOIN accounts a ON pl.account_id = a.id
      WHERE pl.account_id = $1 AND je.status = 'posted'
    `;
    const params = [accountId];

    if (startDate) {
      query_text += ` AND je.journal_date >= $${params.length + 1}`;
      params.push(startDate);
    }

    if (endDate) {
      query_text += ` AND je.journal_date <= $${params.length + 1}`;
      params.push(endDate);
    }

    query_text += ` ORDER BY je.journal_date ASC, pl.id ASC 
                   LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, (page - 1) * limit);

    const result = await query(query_text, params);

    // Calculate running balance
    let balance = 0;
    const ledgerWithBalance = result.rows.map(row => {
      const debit = parseFloat(row.debit) || 0;
      const credit = parseFloat(row.credit) || 0;
      balance += (debit - credit);
      return { ...row, balance };
    });

    res.json({
      data: ledgerWithBalance,
      pagination: { page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getTrialBalance = async (req, res, next) => {
  try {
    const { asOfDate } = req.query;

    const dateFilter = asOfDate ? ` AND je.journal_date <= $1` : '';
    const params = asOfDate ? [asOfDate] : [];

    const result = await query(
      `SELECT a.id, a.account_number, a.account_name, a.account_type,
              COALESCE(SUM(CASE WHEN pl.debit IS NOT NULL THEN pl.debit ELSE 0 END), 0) as total_debit,
              COALESCE(SUM(CASE WHEN pl.credit IS NOT NULL THEN pl.credit ELSE 0 END), 0) as total_credit
       FROM accounts a
       LEFT JOIN postings pl ON a.id = pl.account_id
       LEFT JOIN journal_entries je ON pl.journal_id = je.id AND je.status = 'posted'
       ${dateFilter}
       GROUP BY a.id, a.account_number, a.account_name, a.account_type
       ORDER BY a.account_number ASC`,
      params
    );

    let totalDebits = 0;
    let totalCredits = 0;

    const accountBalances = result.rows.map(row => {
      const debit = parseFloat(row.total_debit) || 0;
      const credit = parseFloat(row.total_credit) || 0;
      totalDebits += debit;
      totalCredits += credit;

      return {
        accountNumber: row.account_number,
        accountName: row.account_name,
        accountType: row.account_type,
        debit,
        credit,
        balance: debit - credit
      };
    });

    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    res.json({
      asOfDate: asOfDate || new Date().toISOString().split('T')[0],
      accounts: accountBalances,
      totals: {
        totalDebits,
        totalCredits,
        difference: totalDebits - totalCredits,
        isBalanced
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountLedgerSummary = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT a.id, a.account_number, a.account_name, a.account_type,
              COALESCE(SUM(CASE WHEN pl.debit IS NOT NULL THEN pl.debit ELSE 0 END), 0) as total_debit,
              COALESCE(SUM(CASE WHEN pl.credit IS NOT NULL THEN pl.credit ELSE 0 END), 0) as total_credit
       FROM accounts a
       LEFT JOIN postings pl ON a.id = pl.account_id
       LEFT JOIN journal_entries je ON pl.journal_id = je.id AND je.status = 'posted'
       GROUP BY a.id, a.account_number, a.account_name, a.account_type
       ORDER BY a.account_number ASC`
    );

    const summary = result.rows.map(row => ({
      id: row.id,
      accountNumber: row.account_number,
      accountName: row.account_name,
      accountType: row.account_type,
      debit: parseFloat(row.total_debit) || 0,
      credit: parseFloat(row.total_credit) || 0,
      balance: (parseFloat(row.total_debit) || 0) - (parseFloat(row.total_credit) || 0)
    }));

    res.json({ data: summary });
  } catch (error) {
    next(error);
  }
};
