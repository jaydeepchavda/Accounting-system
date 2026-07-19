# Accounting System Backend

Backend API for the Accounting System built with Node.js, Express, and PostgreSQL.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

### Environment Variables

Create a `.env` file:

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/accounting_system
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d
NODE_ENV=development
```

## Project Structure

- `src/` - Source code
  - `config/` - Configuration files
  - `middleware/` - Express middleware
  - `routes/` - API route definitions
  - `controllers/` - Request handlers
  - `models/` - Database models
  - `services/` - Business logic
  - `utils/` - Utility functions
- `db/` - Database migrations and seeds
- `tests/` - Test files

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh` - Refresh JWT token
- POST `/api/auth/logout` - Logout user

### Journals
- GET `/api/journals` - List all journal entries
- POST `/api/journals` - Create journal entry
- PUT `/api/journals/:id` - Update journal entry
- DELETE `/api/journals/:id` - Delete journal entry

### Special Journals
- GET `/api/journals/sales` - Sales journal
- GET `/api/journals/purchases` - Purchases journal
- GET `/api/journals/cash` - Cash journal
- GET `/api/journals/bank` - Bank journal

### Ledger & Trial Balance
- GET `/api/ledger/:accountId` - Get account ledger
- GET `/api/trial-balance` - Generate trial balance
- GET `/api/accounts` - Chart of accounts

### Budgeting
- GET `/api/budgets` - List budgets
- POST `/api/budgets` - Create budget
- GET `/api/budgets/:id/variance` - Budget variance analysis

### Workflows
- GET `/api/workflows` - List approval workflows
- POST `/api/workflows/:id/approve` - Approve journal
- POST `/api/workflows/:id/reject` - Reject journal

## Running Tests

```bash
npm test
npm run test:watch
```

## Development

Start development server with hot reload:

```bash
npm run dev
```

Lint code:

```bash
npm run lint
```
