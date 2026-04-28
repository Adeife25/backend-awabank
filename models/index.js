const { sequelize } = require('../connect');
const User = require('./user');
const Transaction = require('./transaction');
const Loan = require('./loan');

// Define associations
User.hasMany(Transaction, {
  foreignKey: 'userId',
  as: 'transactions'
});

Transaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Loan, {
  foreignKey: 'userId',
  as: 'loans'
});

Loan.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Sync database (creates tables if they don't exist)
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Transaction,
  Loan,
  syncDatabase
};