////////////////////////////////////////////////////////////////////////////////
//
// test.js
//
// This model represents a question for the testprep database.
//
////////////////////////////////////////////////////////////////////////////////


const mongoose = require('mongoose');




const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // A test has zero or more questions. Questions have 1 or more choices.
  // One or more choices may be correct.
  "questions": [{
    "text": {
      type: String,
      required: true
    }, 
    "type": {
      type: String,
      required: true
    },
    "choices": [{
      "text": {
        type: String,
        required: true
      },
      "isAnswer": {
        type:Boolean,
        required: true
      }
    }]
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, 
{
  timestamps: true
});


module.exports = mongoose.model('Test', testSchema);
