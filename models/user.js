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
          exclude: [],
        },
      },
      hooks: {
        beforeCreate: (user, options) => {
          let { password } = user;
          const hash = bcrypt.hashSync(password, saltRounds);
          user.dataValues.password = hash;
        },
        beforeUpdate: (user, options) => {
          let { password } = user;
          const hash = bcrypt.hashSync(password, saltRounds);
          user.dataValues.password = hash;
        },
      },
    },
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
