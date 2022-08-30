const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./../models');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User.findAll({}).then(users => {
    users.map(user => delete user.password);
    res.status(200).json(users);
  });
});

/* GET check user availability */
router.get(
  '/signin_with_token',
  (req, res, next) =>
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
      if (err || !user) {
        res.status(404).json({
          type: 'Not Found',
          message: 'Unable to authenticate user with provided token.',
        });
      } else {
        return next();
      }
    })(req, res, next),
  function(req, res, next) {
    let authorization = req.headers.authorization;
    let jwt_token = authorization.split(' ')[1];
    jwt.verify(
      jwt_token,
      '5ebe2294ecd0e0f08eab7690d2a6ee69',
      (err, payload) => {
        db.User.findByPk(payload.id).then(user => {
          if (user) {
            let token = jwt.sign(
              { id: user.id },
              '5ebe2294ecd0e0f08eab7690d2a6ee69',
            );
            delete user.password;
            res.status(200).json({ token, user });
          } else {
            res.status(404).json({
              code: 404,
              type: 'Not Found',
              message: 'Unable to authenticate user with provided token.',
            });
          }
        });
      },
    );
  },
);

/* POST create a user. */
router.post('/signin', function(req, res, next) {
  db.User.findOne({
    where: {
      email: req.body.email,
    },
  }).then(user => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then(result => {
        if (result) {
          let token = jwt.sign(
            { id: user.id },
            '5ebe2294ecd0e0f08eab7690d2a6ee69',
          );
          delete user.password;
          res.status(200).json({ token, user });
        } else {
          res.status(404).json({
            code: 404,
            type: 'Not Found',
            message: 'Email or password is incorrect',
          });
        }
      });
    } else {
      res.status(404).json({
        code: 404,
        type: 'Not Found',
        message: 'Email or password is incorrect',
      });
    }
  });
});

module.exports = router;
