const { DataTypes, UUID, UUIDV4, STRING, literal } = require('sequelize');
const sequelize = require('../util/database');

const Assignment = sequelize.define(
    'assignment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        readOnly: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        field: 'user_id',
      },
      name: {
        type: DataTypes.STRING,
        required: true,
      },
      points: {
        type: DataTypes.INTEGER,
        required: true,
        validate: {
          min: {
              args: [1],
              msg: 'Points should be no less than 1'
          },
          max: {
              args: [10],
              msg: 'Points should be no more than 10'
          }
        }
      },
      num_of_attemps: {
        type: DataTypes.INTEGER,
        required: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      assignment_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      assignment_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      updatedAt: 'assignment_updated',
      createdAt: 'assignment_created',
    }
  )

  Assignment.associate = (models) => {
    models.Assignment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    })
  }

// try {
//     await sequelize.authenticate();
//     console.log('Database connection has been established successfully.');
//     await Assignment.sync({ alter: true })
//     console.log("Assignment model was synchronized successfully.");
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }

module.exports = Assignment;