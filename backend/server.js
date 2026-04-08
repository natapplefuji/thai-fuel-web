require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET env var is required');
}

const express = require('express');
const cors = require('cors');
const fuelPrices = require('./data/fuelPrices');

require('./db'); // trigger DB init and migrations

const authRoutes = require('./routes/auth');
const expensesRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expensesRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/fuel-prices', (_req, res) => {
  // Refresh lastUpdated on each call so it reflects server time
  res.json({ ...fuelPrices, lastUpdated: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Thai Fuel API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
