'use strict';
module.exports = function (sequelize, DataTypes) {
  var gabs = sequelize.define('gabs', {
    description: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    author: DataTypes.STRING
  })

  gabs.associate = function (models) {
    gabs.belongsTo(models.users);
    gabs.hasMany(models.likes);
  }
  return gabs;
};

