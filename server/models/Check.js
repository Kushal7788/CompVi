const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CheckSchema = new mongoose.Schema({
  checkId: { 
    type: String, 
    default: () => uuidv4() // Auto-populate with a new UUID
  },
  data: { 
    type: Object,
    default: () => ({}) // Initialize as an empty object
  }
});

module.exports.Check = mongoose.model('Check', CheckSchema);
