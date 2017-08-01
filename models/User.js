var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  number: {type: String, required: true, unique: true},
  password: {type: String},
  fullname: {type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("User",UserSchema);
