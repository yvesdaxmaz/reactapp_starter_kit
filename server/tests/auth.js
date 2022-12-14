process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var app = require('../app');
var db = require('./../models');
var jwt = require('jsonwebtoken');

chai.should();
chai.use(chaiHttp);

describe('Api auth routes', () => {
  beforeEach(done => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  describe('POST route /auth/signin', () => {
    it('should not signed in unexisting user', done => {
      chai
        .request(app)
        .post('/auth/signin')
        .send({
          email: 'johndoe@example.com',
          password: '123456',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.type.should.be.eql('Not Found');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Email or password is incorrect');
          done();
        });
    });
    it('should not signed in user with wrong password', done => {
      db.User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }).then(user => {
        chai
          .request(app)
          .post('/auth/signin')
          .send({
            email: 'johndoe@example.com',
            password: '123454',
          })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.type.should.be.eql('Not Found');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('Email or password is incorrect');
            done();
          });
      });
    });
    it('should signed in a user', done => {
      db.User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }).then(user => {
        chai
          .request(app)
          .post('/auth/signin')
          .send({
            email: 'johndoe@example.com',
            password: '123456',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            res.body.user.should.be.a('object');
            res.body.user.email.should.be.eql('johndoe@example.com');
            done();
          });
      });
    });
  });

  describe('POST route /auth/signin', () => {
    it('should not signed in unexisting user', done => {
      chai
        .request(app)
        .post('/auth/signin')
        .send({
          email: 'johndoe@example.com',
          password: '123456',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.type.should.be.eql('Not Found');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Email or password is incorrect');
          done();
        });
    });
  });

  describe('GET route /auth/signin_with_token', () => {
    it('should not authenticate user without valid token', done => {
      chai
        .request(app)
        .get('/auth/signin_with_token')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.type.should.be.eql('Not Found');
          res.body.code.should.be.eql(404);
          res.body.message.should.be.eql(
            'Unable to authenticate user with provided token.',
          );
          done();
        });
    });

    it('should not authenticate user without valid token', done => {
      db.User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }).then(user => {
        let token = jwt.sign(
          { id: user.id },
          '5ebe2294ecd0e0f08eab7690d2a6ee69',
        );
        chai
          .request(app)
          .get('/auth/signin_with_token')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            res.body.user.should.be.a('object');
            res.body.user.email.should.be.eql('johndoe@example.com');
            done();
          });
      });
    });
  });
});
