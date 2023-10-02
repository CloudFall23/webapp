const Sequelize = require('sequelize');

//DB SPECs
const sequelize = new Sequelize('postgres', 'postgres', 'root', {
  dialect: 'postgres',
  host: 'localhost'
});

module.exports = sequelize;