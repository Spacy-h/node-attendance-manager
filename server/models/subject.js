var mongoose = require('mongoose');

var Subjects = mongoose.model('Subjects', {
  subjectName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  totalClasses: {
    type: Number,
    default: null
  },
  attendedClasses: {
    type: Number,
    default: null
  },
  percentage: {
    type: Number,
    default: null
  },
  _creator : {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports ={
  Subjects
};
