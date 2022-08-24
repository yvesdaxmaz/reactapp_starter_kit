var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var db = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (process.env.NODE_ENV == 'development') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// Setting passport for authentication
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: '5ebe2294ecd0e0f08eab7690d2a6ee69',
};
passport.use(
  new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    let { id } = jwt_payload;
    db.User.findByPk(id).then(user => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }),
);

// Setting Swagger
app.use('/api/docs', swaggerUi.serve);
app.get('/api/docs', swaggerUi.setup(require('./swagger.json')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
