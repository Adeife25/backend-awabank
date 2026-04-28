const { DataTypes } = require('sequelize');
const { sequelize } = require('../connect');

const Loan = sequelize.define('Loan', {
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
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 100
    }
  },
  purpose: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  term: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Loan term in months'
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Annual interest rate in percentage'
  },
  monthlyPayment: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'disbursed', 'completed'),
    defaultValue: 'pending'
  },
  eligibilityScore: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100
    }
  },
  aiAnalysis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  applicationNumber: {
    type: DataTypes.STRING(50),
    unique: true
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  disbursedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'loans',
  timestamps: true,
  hooks: {
    beforeCreate: (loan) => {
      // Generate application number
      if (!loan.applicationNumber) {
        loan.applicationNumber = 'LOAN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
      }
    }
  }
});

module.exports = Loan;