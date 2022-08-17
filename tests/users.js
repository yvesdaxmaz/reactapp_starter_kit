process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var app = require('../app');
var db = require('./../models');
const jwt = require('jsonwebtoken');

chai.should();
chai.use(chaiHttp);

describe('Users api routes', () => {
  beforeEach(done => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  describe('GET route /api/users/:user_id', () => {
    it('should not allow unauthenticated user to get user info', done => {
      chai
        .request(app)
        .get('/api/users/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property('message')
            .to.be.eql('UnauthorizedError: No authorization token was found');
          done();
        });
    });

    it('should allow authenticated user to get user info', done => {
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
          .get('/api/users/1')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.email.should.be.eql('johndoe@example.com');
            res.body.name.should.be.eql('John Doe');

            done();
          });
      });
    });

    it('should return a single users', done => {
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
          .get('/api/users/1')
          .set('Authorization', `Bearer ${token}`)
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

  describe('PUT route /api/users/:user_id', () => {
    it('should not allow unauthenticated user to update user field', done => {
      chai
        .request(app)
        .put('/api/users/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property('message')
            .to.be.eql('UnauthorizedError: No authorization token was found');
          done();
        });
    });

    it('should allow authenticated user to update user field', done => {
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
          .put('/api/users/1')
          .set('authorization', `Bearer ${token}`)
          .send({
            email: 'john@doe.com',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('email').to.be.eql('john@doe.com');
            done();
          });
      });
    });

    it("should not allow authenticated to update other user's profile", done => {
      db.User.bulkCreate([
        { name: 'John Doe', email: 'johndoe@example.com', password: '123456' },
        { name: 'Jeanne', email: 'jeannedoe@example.com', password: '123456' },
      ]).then(users => {
        let token = jwt.sign(
          { id: users[0].id },
          '5ebe2294ecd0e0f08eab7690d2a6ee69',
        );
        chai
          .request(app)
          .put('/api/users/2')
          .set('authorization', `Bearer ${token}`)
          .send({
            email: 'john@doe.com',
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('message')
              .to.be.eql(
                'UnauthorizedError: You are not allowed to perform this action',
              );
            done();
          });
      });
    });

    it('should not allow update user with invalid email', done => {
      db.User.create({
        name: 'Jeanne',
        email: 'jeannedoe@example.com',
        password: '123456',
      }).then(user => {
        let token = jwt.sign(
          { id: user.id },
          '5ebe2294ecd0e0f08eab7690d2a6ee69',
        );
        chai
          .request(app)
          .put('/api/users/1')
          .set('authorization', `Bearer ${token}`)
          .send({
            email: 'johndoe.com',
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.errors.should.be.a('object');
            res.body.errors.email.should.be.a('object');
            res.body.errors.email.errors.length.should.be.eql(1);
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
