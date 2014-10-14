var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var userInfo = mongoose.Schema({
    username: String,
    password: String,
    data: Array
});

userInfo.methods.genHash = bcrypt.hashSync;
userInfo.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = exports = mongoose.model('User', userInfo);
