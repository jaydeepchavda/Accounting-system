import { query } from '../../src/config/database.js';
import { hashPassword } from '../../src/services/authService.js';

async function seed() {
  try {
    console.log('Starting database seed...');

    // Seed users
    const adminPassword = await hashPassword('admin@123');
    const userPassword = await hashPassword('user@123');

    await query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES 
       ($1, $2, 'Admin User', 'admin'),
       ($3, $4, 'John Accountant', 'accountant')
       ON CONFLICT (email) DO NOTHING`,
      ['admin@example.com', adminPassword, 'john@example.com', userPassword]
    );

    console.log('✓ Users seeded');

    // Seed chart of accounts
    const accountsData = [
      { number: '1000', name: 'Cash', type: 'Asset' },
      { number: '1010', name: 'Accounts Receivable', type: 'Asset' },
      { number: '1020', name: 'Inventory', type: 'Asset' },
      { number: '1050', name: 'Equipment', type: 'Asset' },
      { number: '2000', name: 'Accounts Payable', type: 'Liability' },
      { number: '2010', name: 'Short-term Loan', type: 'Liability' },
      { number: '3000', name: 'Owner Capital', type: 'Equity' },
      { number: '4000', name: 'Sales Revenue', type: 'Revenue' },
      { number: '4010', name: 'Service Revenue', type: 'Revenue' },
      { number: '5000', name: 'Cost of Goods Sold', type: 'Expense' },
      { number: '5100', name: 'Salaries & Wages', type: 'Expense' },
      { number: '5200', name: 'Rent Expense', type: 'Expense' },
      { number: '5300', name: 'Utilities', type: 'Expense' },
    ];

    for (const acc of accountsData) {
      await query(
        `INSERT INTO accounts (account_number, account_name, account_type)
         VALUES ($1, $2, $3)
         ON CONFLICT (account_number) DO NOTHING`,
        [acc.number, acc.name, acc.type]
      );
    }

    console.log('✓ Chart of accounts seeded');

    console.log('Database seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
