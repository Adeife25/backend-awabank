const { Transaction, User } = require('../models');

// Credit user account
const creditAccount = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const user = req.user;

    user.balance = Number(user.balance) + Number(amount);
    await user.save();

    const transaction = await Transaction.create({
      userId: user.id,
      type: 'credit',
      amount,
      description,
      balanceAfter: user.balance
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Debit user account
const debitAccount = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const user = req.user;

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= amount;
    await user.save();

    const transaction = await Transaction.create({
      userId: user.id,
      type: 'debit',
      amount,
      description,
      balanceAfter: user.balance
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get transaction history
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { creditAccount, debitAccount, getTransactions };
