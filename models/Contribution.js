const { DataTypes } = require('sequelize');
const { sequelize } = require('./Sequelize'); // Make sure to import your Sequelize instance

const Contribution = sequelize.define('Contribution', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contributionType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  units: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  additionalDetails: {
    type: DataTypes.TEXT,
  },
});

module.exports = Contribution;
