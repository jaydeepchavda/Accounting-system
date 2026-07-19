import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/index.js';
import { authMiddleware, errorHandler } from './middleware/auth.js';

// Import routes
import authRoutes from './routes/auth.js';
import journalRoutes from './routes/journals.js';
import ledgerRoutes from './routes/ledger.js';
import budgetRoutes from './routes/budgets.js';
import workflowRoutes from './routes/workflows.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/workflows', workflowRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.env} mode`);
});

export default app;
