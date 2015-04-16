"use strict";
module.exports = function(sequelize, DataTypes) {
  var email = sequelize.define("email", {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.email.belongsTo(models.user);
      }
    }
  });
  return email;
};