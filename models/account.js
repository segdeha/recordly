var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// passport-local-mongoose salts & hashes passwords
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
	username: String,
	password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
