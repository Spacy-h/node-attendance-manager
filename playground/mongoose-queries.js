const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Subjects} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b87dac572893b079ce7bc18';

User.findById(id).then((user) => {
  if(!user){
    return console.log('Id not found');
  }
  console.log('User By Id', user);
}).catch((e) => {
  console.log(e);
});
