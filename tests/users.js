process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var app = require('../app');
var db = require('./../models');

chai.should();
chai.use(chaiHttp);

describe('Users api routes', () => {
  beforeEach(done => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  describe('GET route /api/users/:user_id', () => {
    it('should return a single users', done => {
      db.User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }).then(user => {
        chai
          .request(app)
          .get('/api/users/1')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.email.should.be.eql('johndoe@example.com');
            res.body.name.should.be.eql('John Doe');
            done();
          });
      });
    });
  });

  describe('GET route /api/users', () => {
    it('should return all users in the database', done => {
      db.User.bulkCreate([
        { name: 'John Doe', email: 'johndoe@example.com', password: '123456' },
        { name: 'Jeanne', email: 'jeannedoe@example.com', password: '123456' },
      ]).then(users => {
        chai
          .request(app)
          .get('/api/users')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(2);
            done();
          });
      });
    });
  });
  describe('POST route /api/users', () => {
    it('should not signed in a user without name', done => {
      let user = {
        email: 'johndoe@example.com',
        password: 'password',
      };
      chai
        .request(app)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors.should.be.a('object');
          res.body.errors.name.should.be.a('object');
          res.body.errors.name.errors.length.should.be.eql(2);
          done();
        });
    });

    it('should not signed in a user without email', done => {
      let user = {
        name: 'John Doe',
        password: 'password',
      };
      chai
        .request(app)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors.should.be.a('object');
          res.body.errors.email.should.be.a('object');
          res.body.errors.email.errors.length.should.be.eql(1);
          done();
        });
    });

    it('should not signed in a user without password', done => {
      let user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };
      chai
        .request(app)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors.should.be.a('object');
          res.body.errors.password.should.be.a('object');
          res.body.errors.password.errors.length.should.be.eql(1);
          done();
        });
    });

    it('should not signed in a user with short password', done => {
      let user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'passw',
      };
      chai
        .request(app)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors.should.be.a('object');
          res.body.errors.password.should.be.a('object');
          res.body.errors.password.errors.length.should.be.eql(1);
          done();
        });
    });

    it('should signed in a new user', done => {
      let user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };
      chai
        .request(app)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(200);
          res.body.should.have
            .property('message')
            .eql('Successfully signed up!');
          done();
        });
    });

    it('should not signed in a user with a used email address', done => {
      let userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      };

      db.User.create(userData).then(user => {
        chai
          .request(app)
          .post('/api/users')
          .send(userData)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(409);
            res.body.should.be.a('object');
            res.body.errors.should.be.a('object');
            res.body.errors.email.should.be.a('object');
            res.body.errors.email.errors.length.should.be.eql(1);
            res.body.errors.email.errors.should.contain(
              'Email already exists.',
            );
            done();
          });
      });
    });
  });
});
