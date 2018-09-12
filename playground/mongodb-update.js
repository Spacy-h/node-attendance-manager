const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/AttendanceManager', (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('AttendanceManager');

  db.collection('Users').findOneAndUpdate({
  _id: new ObjectID('5b87cc836213e10628f57977')
},{
  $set: {
    name: 'ABC'
  },
  $inc: {
    age: 1
  }
},{
  returnOriginal: false
}).then((result) => {
  console.log(result);
})
});
