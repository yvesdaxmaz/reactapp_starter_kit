const express = require('express');
const { checkSchema, validationResult } = require('express-validator');
const router = express.Router();
const db = require('./../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User.findAll({}).then(users => {
    users.map(user => delete user.password);
    res.status(200).json(users);
  });
});

/* POST create a user. */
router.post(
  '/',
  checkSchema({
    name: {
      exists: true,
      isString: true,
      errorMessage: 'Name is required',
    },
    email: {
      isEmail: true,
      errorMessage: 'You must provide a valid email',
    },
    password: {
      isLength: {
        errorMessage: 'Password must have more than 6 characters',
        options: { min: 6 },
      },
    },
  }),
  function(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) {
      db.User.findOne({
        where: {
          email: req.body.email,
        },
      }).then((user, err) => {
        if (user) {
          res.status(409).json({
            code: 409,
            type: 'Duplicated',
            message: 'Duplicate email address!',
          });
        } else {
          db.User.create(req.body).then(user => {
            res.status(200).json({
              message: 'Successfully signed up!',
            });
          });
        }
      });
    } else {
      let errors = Array.from(result.errors).reduce(
        (accumulator, { param, msg, value }) => {
          let keys = Object.keys(accumulator);
          if (keys.indexOf(param) != -1) {
            accumulator[param].errors.push(msg);
          } else {
            accumulator[param] = {
              errors: [msg],
            };
          }
          return accumulator;
        },
        {},
      );
      res.status(400).json({ code: 400, type: 'ValidationError', errors });
    }
  },
);

module.exports = router;
