require('dotenv').config();
const Sequelize = require('sequelize');
const dbvar = require('./dbvar');
//console.log(process.env.DB_USER);

const isAwsRDS = process.env.DB_HOST && process.env.DB_HOST.includes('.rds.amazonaws.com');

const sequelizeConfig = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
};

if (isAwsRDS) {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize(process.env.DB_POSTGRESQL, process.env.DB_USER, process.env.DB_PASSWORD, sequelizeConfig);

//Old Stuff ---
//DB SPECs
// const sequelize = new Sequelize(process.env.DB_POSTGRESQL, process.env.DB_USER, process.env.DB_PASSWORD, {
//   dialect: 'postgres',
//   host: process.env.DB_HOST,
//   // dialectOptions: {
//   //   ssl: {
//   //       //require: process.env.DB_HOST == 'localhost'?false:true,
//   //       require: false,
//   //       rejectUnauthorized: false
//   //   }
//   // },


// });
//Old stuff ---



module.exports = sequelize;