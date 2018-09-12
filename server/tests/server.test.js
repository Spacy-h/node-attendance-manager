const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Subjects} = require('./../models/subject');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateSubjects);
beforeEach(populateTodos);

describe('POST /subjects', () => {
  it('should create a new Subject', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/subjects')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Subjects.find({text}).then((todos) => {
          expect(subjects.length).toBe(1);
          expect(subjects[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/subjects')
    .set('x-auth', users[0].tokens[0].token)
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Subjects.find().then((todos) => {
        expect(subjects.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /subjects', () => {
 it('should get all subects', (done) => {
   request(app)
   .get('/subjects')
   .set('x-auth', users[0].tokens[0].token)
   .expect(200)
   .expect((res) => {
     expect(res.body.subjects.length).toBe(1);
   })
   .end(done);
   });
 });

 describe('GET /subects/:id', () => {
   it('should return a todo doc', (done) => {
     request(app)
     .get(`/todos/${subjects[0]._id.toHexString()}`)
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((res) => {
       expect(res.body.subjects.text).toBe(todos[0].text);
     })
     .end(done);
   });

   it('should not return subjects doc created by other user', (done) => {
     request(app)
     .get(`/subjects/${subjects[1]._id.toHexString()}`)
     .set('x-auth', users[0].tokens[0].token)
     .expect(404)
     .end(done);
   });

   it('should return 404 if subjects not found', (done) => {
     var hexId = new ObjectID().toHexString();
     request(app)
     .get(`/subjects/${hexId}`)
     .set('x-auth', users[0].tokens[0].token)
     .expect(404)
     .end(done);
   });

   it('should return 404 for non-object Ids', (done) => {
     request(app)
     .get('/todos/123abc')
     .set('x-auth', users[0].tokens[0].token)
     .expect(404)
     .end(done);
   });
 });

describe('DELETE /subjects/:id', () => {
  it('should remove a subject', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/subjects/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.subjects._id).toBe(hexId);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeFalsy();
        done();
      }).catch((e) => {
        done(e)
      });
    });
  });

  it('should remove a subject', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/subjects/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Subjects.findById(hexId).then((todo) => {
        expect(todo).toExist();
        done();
      }).catch((e) => {
        done(e)
      });
    });
  });


  it('should return 404 if subject not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/subjects/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    request(app)
    .delete('/subjects/123abc')
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
    });
  });

  describe('PATCH /subjects/:id' , () => {
    it('should update the todo', (done) => {
      var hexId = subjects[0]._id.toHexString();
      var text = 'This should be the new text';

      request(app)
      .patch(`/subjects/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.subject.text).toBe(text);
        expect(res.body.subject.completed).toBe(true);
        expect(typeof res.body.subject.completedAt).toBe('number');
    })
      .end(done);
  });

  it('should not update the subject created by other user', (done) => {
    var hexId = subjects[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
    .patch(`/subjects/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: true,
      text
    })
    .expect(404)
    .end(done);
  });

    it('should clear completedAt when subject is not completed', (done) => {
      var hexId = subjects[1]._id.toHexString();
      var text = 'This should be the new text!!';

      request(app)
      .patch(`/subjects/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.subjects.text).toBe(text);
        expect(res.body.subjects.completed).toBe(false);
        expect(res.body.subjects.completedAt).toBeFalsy();
    })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login' , () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access : 'auth',
            token : res.headers['x-auth']
          });
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          // expect(user.tokens[0]).toInclude({
          //   access : 'auth',
          //   token : res.headers['x-auth']
          // });
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', () => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => {
          done(e);
        })
      });
    });
});
