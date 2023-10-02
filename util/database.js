const Sequelize = require('sequelize');
const dbvar = require('./dbvar');

//DB SPECs
const sequelize = new Sequelize(dbvar.DB, dbvar.USER, dbvar.PASSWORD, {
  dialect: dbvar.DIALECT,
  host: dbvar.HOST
});

module.exports = sequelize;