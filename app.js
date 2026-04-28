const express = require('express');
const app = express();
require('dotenv').config();

const { syncDatabase } = require('./models');

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Test route
app.get('/', (req, res) => {
  res.send('Banking API running');
});

// Start server
const PORT = process.env.PORT || 5000;

syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);
