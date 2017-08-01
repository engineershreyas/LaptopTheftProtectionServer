var mongoose = require('mongoose');

var NumberSchema = new mongoose.Schema({
  number: {type: String, required: true, unique: true},
  pings: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Number", NumberSchema);
