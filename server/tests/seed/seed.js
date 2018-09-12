const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Subjects} = require('./../../models/subject');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'one@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'two@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const subjects = [{
  _id: new ObjectID(),
  subjectName: 'First Subject',
  totalClasses: 40,
  attendedClasses: 36,
  _creator: userOneId
},{
  _id: new ObjectID(),
  subjectName: 'Second Subject',
  totalClasses: 40,
  attendedClasses: 32,
  _creator: userTwoId
}];

const populateSubjects = (done) => {
  Subjects.remove({}).then(() =>{
    return Subjects.insertMany(subjects);
  }).then(() => {
    done()
  });
};

const populateUsers = (done) => {
  User.remove({}).then(() =>{
  var userOne = new User(users[0]).save();
  var userTwo = new User(users[1]).save();

  return Promise.all([userOne, userTwo])
}).then(() => done());
};
module.exports= {
  subjects,
  populateSubjects,
  users,
  populateUsers
};
