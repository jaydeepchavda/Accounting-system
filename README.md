# Accounting System - Full Stack Web Application

A complete, production-ready accounting system web application built with Angular (frontend) and Node.js/Express (backend) using PostgreSQL.

## 📋 Project Overview

This accounting system provides a comprehensive solution for managing:
- **General Journals** - Record financial transactions
- **Special Journals** - Sales, Purchases, Cash, and Bank journals  
- **Chart of Accounts** - Maintain account structure
- **Ledger & Trial Balance** - Generate reports and validate balance
- **Budgeting** - Create budgets and analyze variance
- **Approval Workflows** - Multi-level journal approval process
- **User Management** - Role-based access control

## 🏗️ Architecture

```
accounting-system/
├── backend/          # Node.js Express API
├── frontend/         # Angular Web UI
└── README.md        # This file
```

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs

### Frontend
- **Framework**: Angular 17
- **UI Framework**: Bootstrap 5
- **HTTP Client**: Angular HttpClient
- **Charts**: Chart.js with ng2-charts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env

# Update .env with your PostgreSQL connection
# DATABASE_URL=postgresql://user:password@localhost:5432/accounting_system

# Run migrations
npm run migrate

# Seed sample data
npm run seed

# Start development server
npm run dev
```

**Backend runs on**: `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm start
```

**Frontend runs on**: `http://localhost:4200`

### Login Credentials

After seeding, use these credentials:
- **Email**: `admin@example.com`
- **Password**: `admin@123`

Or:
- **Email**: `john@example.com`
- **Password**: `user@123`

## 📦 Project Structure

### Backend (`/backend`)

```
src/
├── config/              # Configuration files
│   ├── index.js        # Main config
│   └── database.js     # PostgreSQL connection
├── middleware/
│   └── auth.js         # JWT and error handling
├── routes/             # API routes
│   ├── auth.js
│   ├── journals.js
│   ├── ledger.js
│   ├── budgets.js
│   └── workflows.js
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── journalController.js
│   ├── ledgerController.js
│   ├── budgetController.js
│   └── workflowController.js
├── services/           # Business logic
│   └── authService.js
└── index.js           # Express app entry point

db/
├── migrations/        # Database schema
│   └── 001_initial_schema.sql
└── seeds/            # Sample data
    └── seed.js
```

### Frontend (`/frontend`)

```
src/app/
├── core/
│   ├── services/
│   │   └── auth.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── interceptors/
│       └── jwt.interceptor.ts
├── modules/
│   ├── auth/           # Login/Register
│   ├── dashboard/      # Main dashboard
│   ├── journals/       # Journal management
│   ├── ledger/         # Ledger & reports
│   └── budgeting/      # Budget management
├── shared/
│   ├── components/     # Reusable components
│   └── models/         # TypeScript interfaces
└── app-routing.module.ts
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

### Journals
- `GET /api/journals` - List journals
- `POST /api/journals` - Create journal
- `GET /api/journals/:id` - Get journal details
- `PUT /api/journals/:id` - Update journal
- `DELETE /api/journals/:id` - Delete journal

### Ledger & Reports
- `GET /api/ledger/:accountId` - Get account ledger
- `GET /api/ledger/trial-balance` - Trial balance
- `GET /api/ledger/summary` - Account summary

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/:id` - Get budget
- `GET /api/budgets/:id/variance` - Budget variance analysis

### Workflows
- `GET /api/workflows` - List pending approvals
- `POST /api/workflows/:id/submit` - Submit for approval
- `POST /api/workflows/:id/approve` - Approve journal
- `POST /api/workflows/:id/reject` - Reject journal
- `GET /api/workflows/:id/history` - View workflow history

## 🗄️ Database Schema

### Key Tables
- **users** - User accounts with authentication
- **accounts** - Chart of accounts
- **journal_entries** - General journal entries with status tracking
- **journal_line_items** - Individual debit/credit lines
- **postings** - Posted entries for ledger
- **sales_journal**, **purchases_journal**, **cash_journal**, **bank_journal** - Special journals
- **budgets**, **budget_accounts** - Budget management
- **workflow_actions** - Approval workflow tracking
- **refresh_tokens** - Token management

## 🔒 Security Features

- JWT authentication with expiring tokens
- Password hashing with bcryptjs
- CORS protection
- Helmet for HTTP security headers
- Input validation and sanitization
- Role-based access control ready
- SQL injection prevention with parameterized queries

## 📝 Features Implemented

### ✅ Core Accounting
- [x] Chart of accounts management
- [x] General journal entry creation and editing
- [x] Special journals (Sales, Purchases, Cash, Bank)
- [x] Ledger posting and account balance tracking
- [x] Trial balance generation and validation
- [x] Transaction status workflow (Draft → Pending → Approved → Posted)

### ✅ Authentication & Security
- [x] User registration and login
- [x] JWT token-based authentication
- [x] Refresh token mechanism
- [x] Password hashing
- [x] Protected routes with auth guard

### ✅ Backend API
- [x] RESTful API design
- [x] Comprehensive error handling
- [x] Input validation
- [x] Database migrations
- [x] Sample data seeding

### ✅ Frontend UI
- [x] Responsive Bootstrap design
- [x] Login/Register forms
- [x] Dashboard with quick actions
- [x] Service-based architecture
- [x] HTTP interceptor for JWT
- [x] Modern Angular patterns

### 🚧 Features Ready for Expansion
- [ ] Advanced reporting and analytics
- [ ] Multi-entity support
- [ ] Batch imports (CSV/Excel)
- [ ] Mobile application
- [ ] Real-time synchronization
- [ ] Audit trail enhancements
- [ ] Role-based dashboards
- [ ] Email notifications
- [ ] API documentation (Swagger)
- [ ] End-to-end testing

## 🧪 Testing

### Backend
```bash
cd backend
npm test
npm run test:watch
```

### Frontend
```bash
cd frontend
npm test
```

## 📚 Development Guide

### Adding a New Feature

1. **Backend**:
   - Create controller in `src/controllers/`
   - Add routes in `src/routes/`
   - Create service if needed in `src/services/`
   - Update database migrations if required

2. **Frontend**:
   - Create module in `src/app/modules/`
   - Create components for UI
   - Create service for API calls
   - Add routes to routing module

### Database Migrations

Add new migration file in `db/migrations/` with format: `NNN_description.sql`

Run migrations:
```bash
npm run migrate
```

## 🐛 Troubleshooting

### Backend Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure migrations have run: `npm run migrate`

### Frontend API Errors
- Check backend is running on port 3000
- Verify CORS_ORIGIN in backend .env
- Check browser console for detailed errors

### Port Already in Use
```bash
# Backend (port 3000)
npx kill-port 3000

# Frontend (port 4200)
npx kill-port 4200
```

## 📖 Documentation Files

- `backend/README.md` - Backend setup and API details
- `frontend/README.md` - Frontend setup and architecture

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## 📄 License

This project is provided as-is for educational and business use.

## 📞 Support

For issues or questions, please refer to the individual README files in backend/ and frontend/ directories.

---

## Next Steps

1. **Complete the setup** as described above
2. **Explore the API** using Postman or similar
3. **Build custom components** for specific needs
4. **Add more special journals** as required
5. **Extend with reports** (income statement, balance sheet, etc.)
6. **Integrate with external systems** (banks, tax systems, etc.)
7. **Deploy to production** (AWS, Azure, GCP, etc.)

---

**Version**: 1.0.0  
**Last Updated**: 2026  
**Ready for Production**: With additional testing and deployment configuration