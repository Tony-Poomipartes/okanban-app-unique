const List = require ('./List');
const Card = require ('./Card');
const Tag = require ('./Tag');

// une carte appartient a une liste
Card.belongsTo(
  List,
  {
    as: 'list',
    foreignKey: 'list_id',
  }
);

// une liste a plusieurs cartes
List.hasMany(
  Card,
  {
    as: 'cards',
    foreignKey: 'list_id',
  }
);

// une card est liée à plusieurs Tag par l'intermédiaire de la table card_has_tag
Card.belongsToMany(
  Tag,
  {
    as: 'tags',
    through: 'card_has_tag',  
    foreignKey: 'card_id', 
    otherKey: 'tag_id', 
    timestamps: false
 }
);

// un tag est liée à plusieurs card par l'intermédiaire de la table card_has_tag
Tag.belongsToMany(
  Card, 
  { 
    as: 'cards', 
    through: 'card_has_tag', 
    foreignKey: 'tag_id', 
    otherKey: 'card_id', 
    timestamps: false 
  }
);

module.exports = {
  List,
  Card,
  Tag,
};