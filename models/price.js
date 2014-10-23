var mongoose = require('mongoose');
var price = mongoose.Schema({
    data: Array,
    date: Date
});

module.exports = exports = mongoose.model('Price', price);
