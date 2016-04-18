const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  exp: Number,
  driver: Boolean,
  driverCount: Number,
  pairedWith: Array
});

module.exports = mongoose.model('Student', studentSchema);