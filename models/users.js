'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  })
  users.associate = function (models) {
    users.hasMany(models.gabs);
    users.hasMany(models.likes);
  }
  return users;
};
 