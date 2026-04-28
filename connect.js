require('dotenv').config();
const { Sequelize } = require('sequelize');
 
const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASS,
  {
    host: process.env.HOST,
    dialect: 'mysql',
    logging: false, // set to console.log to see SQL queries
  }
);

sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Unable to connect:', err));
 
module.exports = { sequelize };

//i think we have not added controller for the virtuallassistant chat bot.