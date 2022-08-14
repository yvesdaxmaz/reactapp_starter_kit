'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'users',
      defaultScope: {
        attributes: {
          exclude: ['password'],
        },
      },
    },
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  User.beforeCreate(async (user, options) => {
    let { password } = user;
    bcrypt.hash(password, saltRounds).then(function(hash) {
      user.password = hash;
    });
  });

  return User;
};
