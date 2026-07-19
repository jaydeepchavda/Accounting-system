# Accounting System Frontend

Angular-based web interface for the Accounting System.

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Angular CLI 17+

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will reload when you change source files.

## Build

```bash
npm run build
```

Build artifacts are stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, guards, interceptors
│   │   ├── services/        # Authentication and API services
│   │   ├── guards/          # Route guards (AuthGuard)
│   │   └── interceptors/    # HTTP interceptors (JWT)
│   ├── modules/             # Feature modules
│   │   ├── auth/           # Login/Register
│   │   ├── dashboard/      # Dashboard
│   │   ├── journals/       # Journal entries management
│   │   ├── ledger/         # Ledger and trial balance
│   │   └── budgeting/      # Budget management
│   ├── shared/             # Shared components, models, utilities
│   └── app-routing.module.ts
├── assets/                  # Static assets
├── environments/            # Environment configurations
├── styles.css              # Global styles
└── main.ts                 # Application entry point
```

## Features

- **Authentication**: Login with email and password
- **Dashboard**: Overview of accounting metrics
- **Journal Management**: Create, edit, and manage journal entries
- **General Ledger**: View account ledgers with running balance
- **Trial Balance**: Generate and view trial balance reports
- **Budgeting**: Create budgets and analyze variance
- **Workflow Management**: Approve or reject journal entries

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Environment Configuration

Configure API endpoint in `src/environments/environment.ts`:

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api'
};
```

## Routing

- `/auth/login` - Login page
- `/dashboard` - Main dashboard
- `/journals` - Journal entries list
- `/journals/new` - Create new journal
- `/ledger` - Account ledger
- `/trial-balance` - Trial balance report
- `/budgets` - Budget management
- `/workflows` - Journal approval workflows
