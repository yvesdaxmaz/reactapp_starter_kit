'use strict';
const casual = require('casual');
const bcrypt = require('bcrypt'); 

const hash =  bcrypt.hashSync('password', 10);

casual.define('user', function() {
  return {
      name: casual.name,
      email: casual.email,
      password: hash,
      createdAt: new Date,
      updatedAt: new Date,
  }
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

      
      return queryInterface.bulkInsert('users', (new Array(50)).fill(casual.user));
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

      return queryInterface.bulkDelete('users', null, {});
  }
};
