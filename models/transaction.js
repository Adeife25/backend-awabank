const { DataTypes } = require('sequelize');
const { sequelize } = require('../connect');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit', 'transfer'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  recipientAccountNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  recipientName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'completed'
  },
  referenceNumber: {
    type: DataTypes.STRING(50),
    unique: true
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  hooks: {
    beforeCreate: (transaction) => {
      // Generate reference number
      if (!transaction.referenceNumber) {
        transaction.referenceNumber = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
      }
    }
  }
});

module.exports = Transaction;