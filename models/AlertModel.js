const { DataTypes } = require('sequelize');

const { sequelize } = require('./Sequelize');

const Alert = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  AlertName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AlertType:{
    type:DataTypes.STRING,
    allowNull:false
  },
  AlertThresholds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ActiveStatus:{
    type:DataTypes.TINYINT,
    defaultValue:1
  },
  
});

module.exports = Alert;
