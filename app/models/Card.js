const { DataTypes, Model } = require('sequelize');
const sequelize = require ('../database');

class Card extends Model {}

Card.init({
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  color: {
    type: DataTypes.STRING,
  }
}, {  
  sequelize,
  tableName: 'card'
});

module.exports = Card;