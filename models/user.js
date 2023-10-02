
const { DataTypes, UUID, UUIDV4, STRING, literal } = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        readOnly: true,
      },
      first_name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: {
          msg: 'Email should be unique',
          fields: ['email'],
        },
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'Email should be a valid email address!',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          len: {
            args: [5, 500],
            msg: 'Password should be between 5 and 15 characters',
          },
        },
      },
      account_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        readOnly: true,
      },
      account_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        readOnly: true,
      },
    },
    {
      updatedAt: 'account_updated',
      createdAt: 'account_created',
    }
  )

module.exports = User;