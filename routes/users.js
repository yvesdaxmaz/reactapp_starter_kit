const express = require('express');
const { check, checkSchema, validationResult } = require('express-validator');
const router = express.Router();
const db = require('./../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User.findAll({}).then(users => {
    users.map(user => delete user.password);
    res.status(200).json(users);
  });
});

/* GET a single user */
router.get(
  '/:user_id',
  (req, res, next) =>
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
      if (err || !user) {
        res.status(401).json({
          message: 'UnauthorizedError: No authorization token was found',
        });
      } else {
        return next();
      }
    })(req, res, next),
  function(req, res, next) {
    db.User.findByPk(req.params.user_id).then(user => {
      res.status(200).json(user);
    });
  },
);

/* PUT update a user. */
router.put(
  '/:user_id',
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
      if (err || !user) {
        res.status(401).json({
          message: 'UnauthorizedError: No authorization token was found',
        });
      } else {
        return next();
      }
    })(req, res, next);
  },
  checkSchema({
    email: {
      isEmail: true,
      optional: {
        nullable: true,
      },
    },
  }),
  function(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) {
      let authorization = req.headers.authorization;
      let jwt_token = authorization.split(' ')[1];
      jwt.verify(
        jwt_token,
        '5ebe2294ecd0e0f08eab7690d2a6ee69',
        (err, payload) => {
          db.User.findByPk(req.params.user_id).then(user => {
            if (user.id == payload.id) {
              user.update(req.body).then(updatedUser => {
                res.status(200).json(updatedUser);
              });
            } else {
              res.status(401).json({
                message:
                  'UnauthorizedError: You are not allowed to perform this action',
              });
            }
          });
        },
      );
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
      res.status(400).json({
        code: 400,
        type: 'ValidationError',
        errors,
      });
    }
  },
);
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
            type: 'ValidationError',
            errors: {
              email: {
                errors: ['Email already exists.'],
              },
            },
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
      res.status(400).json({
        code: 400,
        type: 'ValidationError',
        errors,
      });
    }
  },
);

module.exports = router;
module.exports = router;
