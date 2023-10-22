require('dotenv').config();
const Sequelize = require('sequelize');
const dbvar = require('./dbvar');
//console.log(process.env.DB_USER);

//DB SPECs
const sequelize = new Sequelize(process.env.DB_POSTGRESQL, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  // dialectOptions: {
  //   ssl: {
  //       require: true,
  //       rejectUnauthorized: false
  //   }
  // },
});

module.exports = sequelize;