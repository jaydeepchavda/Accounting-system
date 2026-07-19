-- Migration: Create Accounting System Schema
-- This migration creates all necessary tables for the accounting system

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  account_number VARCHAR(50) UNIQUE NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  journal_date DATE NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, pending, approved, posted, rejected
  created_by INTEGER NOT NULL,
  approved_by INTEGER,
  rejected_by INTEGER,
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  FOREIGN KEY (rejected_by) REFERENCES users(id)
);

-- Journal Line Items
CREATE TABLE IF NOT EXISTS journal_line_items (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  debit DECIMAL(15,2),
  credit DECIMAL(15,2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journal_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Postings (Posted Entries)
CREATE TABLE IF NOT EXISTS postings (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  debit DECIMAL(15,2),
  credit DECIMAL(15,2),
  posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journal_id) REFERENCES journal_entries(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Special Journals - Sales Journal
CREATE TABLE IF NOT EXISTS sales_journal (
  id SERIAL PRIMARY KEY,
  transaction_date DATE NOT NULL,
  customer_id VARCHAR(100) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'recorded',
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Special Journals - Purchases Journal
CREATE TABLE IF NOT EXISTS purchases_journal (
  id SERIAL PRIMARY KEY,
  transaction_date DATE NOT NULL,
  vendor_id VARCHAR(100) NOT NULL,
  vendor_name VARCHAR(255) NOT NULL,
  po_number VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'recorded',
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Special Journals - Cash Journal
CREATE TABLE IF NOT EXISTS cash_journal (
  id SERIAL PRIMARY KEY,
  transaction_date DATE NOT NULL,
  reference_number VARCHAR(100),
  description TEXT,
  debit DECIMAL(15,2),
  credit DECIMAL(15,2),
  cash_account_id INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'recorded',
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cash_account_id) REFERENCES accounts(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Special Journals - Bank Journal
CREATE TABLE IF NOT EXISTS bank_journal (
  id SERIAL PRIMARY KEY,
  transaction_date DATE NOT NULL,
  check_number VARCHAR(50),
  reference_number VARCHAR(100),
  description TEXT,
  debit DECIMAL(15,2),
  credit DECIMAL(15,2),
  bank_account_id INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'recorded',
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bank_account_id) REFERENCES accounts(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  budget_period VARCHAR(50) NOT NULL,
  budget_year INTEGER NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Budget Accounts (Budget line items)
CREATE TABLE IF NOT EXISTS budget_accounts (
  id SERIAL PRIMARY KEY,
  budget_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  budgeted_amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Workflow Actions
CREATE TABLE IF NOT EXISTS workflow_actions (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- submitted, approved, rejected, posted
  performed_by INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journal_id) REFERENCES journal_entries(id),
  FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_accounts_active ON accounts(active);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);
CREATE INDEX idx_journal_entries_date ON journal_entries(journal_date);
CREATE INDEX idx_journal_line_items_journal ON journal_line_items(journal_id);
CREATE INDEX idx_postings_journal ON postings(journal_id);
CREATE INDEX idx_postings_account ON postings(account_id);
CREATE INDEX idx_budgets_year ON budgets(budget_year);
CREATE INDEX idx_budget_accounts_budget ON budget_accounts(budget_id);
