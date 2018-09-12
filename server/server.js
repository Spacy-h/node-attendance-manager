require('./config/config.js')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Subjects} = require('./models/subject');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/subjects', (req, res) => {
  var subjects = new Subjects({
    subjectName: req.body.text,
    _creator: req.user._id
  });
  subjects.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/subjects', authenticate, (req, res) => {
  Subjects.find({
    _creator: req.user._id
  }).then((subjects) => {
    res.send({subjects});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/subjects/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
   return res.status(404).send();
   }

  Subjects.findOne({
    _id: id,
    _creator: req.user._id
  }).then((subjects) => {
    if(!subjects){
      return res.status(404).send();
    }
    res.send({subjects});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.delete('/subjects/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Subjects.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((subjects) => {
    if(!subjects) {
      return res.status(404).send();
    }
    res.send({subjects});
  }).catch((e) => {
    res.status(400).send();
  })
});



app.post('/users', (req, res) => {
//   var user = new User({
//   email: req.body.email,
//   password: req.body.password
// });

  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
  return  user.generateAuthToken();
}).then((token) => {
  res.header('x-auth', token).send(user);
}).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
  });

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  },() => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {
  app
};
