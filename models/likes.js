'use strict';
module.exports = function(sequelize, DataTypes) {
  var likes = sequelize.define('likes', {
  })
  likes.associate = function (models) {
    likes.belongsTo(models.users);
    likes.belongsTo(models.gabs);
  }
  return likes;
};

//undo migrations - set relationship id's in migrations - re migrate - 
//return statements for response, that way you can't accidentally set headers 
//header in view - create once and {{>header}} to insert

