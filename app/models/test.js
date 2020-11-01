////////////////////////////////////////////////////////////////////////////////
//
// test.js
//
// This schema and model represents a question for the testprep database.
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // A test has zero or more questions. Questions have 1 or more choices.
  // One or more choices may be correct.
  "questions": [{
    "text": {
      type: String,
      required: false
    }, 
    "type": {
      type: String,
      required: false
    },
    "choices": [{
      "text": {
        type: String,
        required: false
      },
      "isAnswer": {
        type:Boolean,
        required: true
      }
    }]
  }]
}, 
{
  timestamps: true
});


module.exports = mongoose.model('Test', testSchema);
