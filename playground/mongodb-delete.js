const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/AttendanceManager', (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('AttendanceManager');

  db.collection('Users').findOneAndDelete({
    _id : new ObjectID('5b86bc7c7a944f8cb857ff26')
  }).then((result) => {
    console.log(result);
  })
  });
