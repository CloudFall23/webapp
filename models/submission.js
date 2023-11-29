const { DataTypes, UUID, UUIDV4, STRING, DATE, NOW } = require('sequelize');
const sequelize = require('../util/database');

const Submission = sequelize.define(
  "submission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      readOnly: true,
      primaryKey: true,
    },
    assignment_id: {
      type: DataTypes.UUID,
      field: "assignment_id",
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      field: "user_id",
      allowNull: false,
    },
    submission_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
            args: true,
            msg: 'submission_url cannot be an empty string.',
          },
          isUrl:{
            args: true,
            msg: 'submission_url is invalid',
          }
      },
    },
    submission_date: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: 'Invalid date format.Please use format (e.g., "2016-08-29T09:12:33.001Z").',
        },
      },
    },
    submission_updated: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: 'Invalid date format.Please use format (e.g., "2016-08-29T09:12:33.001Z").',
        },
      },
    },
  },
  {
    updatedAt: "submission_updated",
    createdAt: "submission_date",
  }
);

Submission.associate = (models) => {
  models.Submission.belongsTo(models.Assignment, {
    foreignKey: 'assignment_id',
    as: 'assignment',
    onDelete: 'CASCADE',
  });
};

module.exports = Submission;
