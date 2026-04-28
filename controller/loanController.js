const { Loan, Transaction } = require('../models');
const AIService = require('../services/aiService');
const LoanAnalyzer = require('../services/LoanAnalyzer');

// Apply for a loan
const applyForLoan = async (req, res) => {
  try {
    const { amount, purpose, term } = req.body;
    const user = req.user;

    // Get user transaction history
    const transactions = await Transaction.findAll({ where: { userId: user.id } });

    // AI analysis of loan eligibility
    const aiAnalysis = await AIService.analyzeLoanEligibility(user, transactions, amount);
    const eligibilityScore = AIService.extractEligibilityScore(aiAnalysis);

    // Calculate interest, monthly payment, and status
    const interestRate = LoanAnalyzer.calculateInterestRate(eligibilityScore);
    const monthlyPayment = LoanAnalyzer.calculateMonthlyPayment(amount, interestRate, term);
    const status = LoanAnalyzer.determineLoanStatus(eligibilityScore);

    // Create loan
    const loan = await Loan.create({
      userId: user.id,
      amount,
      purpose,
      term,
      interestRate,
      monthlyPayment,
      eligibilityScore,
      aiAnalysis,
      status
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all loans of logged-in user
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyForLoan, getMyLoans };

 