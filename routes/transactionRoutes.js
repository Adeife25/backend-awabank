const express = require('express');
const router = express.Router();

const {
  creditAccount,
  debitAccount,
  getTransactions
} = require('../controller/transactionController');

const { protect } = require('../middleware/auth');

// Protected routes
router.post('/credit', protect, creditAccount);
router.post('/debit', protect, debitAccount);
router.get('/', protect, getTransactions);

module.exports = router;
