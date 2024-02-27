const { DataTypes } = require('sequelize');

const { sequelize } = require('./Sequelize');

const Notification = sequelize.define('Notification', {
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NotType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message:{
    type:DataTypes.STRING,
    allowNull:false
  },
  timestamp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Viewed:{
    type:DataTypes.TINYINT,
    defaultValue:1
  },
  
});

module.exports = Notification;
