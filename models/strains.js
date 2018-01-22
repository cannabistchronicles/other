let mongoose = require("mongoose");

var schema = mongoose.Schema({
  api_id: String,
  name: String,
  race: String,
  flavors: Array,
  effects: { positive: [String], negative: [String], medical: [String] },
  pics: Array,
  votes: { type: Number, default: 0 }
});
module.exports = mongoose.model("Strain", schema);
