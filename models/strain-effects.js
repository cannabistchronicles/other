let mongoose = require('mongoose');

var schema = mongoose.Schema( {
    type:String,
    name: String,
    count: Number
});

module.exports = mongoose.model('Strain-Effect', schema);