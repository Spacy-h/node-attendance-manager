const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Subjects} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Subjects.findByIdAndRemove('5b896835c2cc3cb9694aa5b8').then((subject) => {
  console.log(subject);
});
