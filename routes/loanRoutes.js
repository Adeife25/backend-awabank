const express = require('express');
const router = express.Router();

const {
  applyForLoan,
  getMyLoans
} = require('../controller/loanController');

const { protect } = require('../middleware/auth');

// All loan routes are protected
router.post('/apply', protect, applyForLoan);
router.get('/my-loans', protect, getMyLoans);

module.exports = router;
