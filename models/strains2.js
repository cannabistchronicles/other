let mongoose = require("mongoose");

var schema = mongoose.Schema({
  api_id: String,
  name: String,
  race: String,
  flavors: Array,
  effects: { positive: Array, negative: Array, medical: Array }
});
module.exports = mongoose.model("Strain", schema);
